import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Get admin username from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');
const REPORTS_INDEX_FILE = path.join(REPORTS_DIR, 'index.json');
const CHARTS_DIR = path.join(process.cwd(), 'public', 'reports', 'charts');
const DATA_DIR = path.join(process.cwd(), 'public', 'reports', 'data');

// Ensure directories exist
[REPORTS_DIR, CHARTS_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

interface Report {
  id: string;
  token: string;
  clientName: string;
  generatedDate: string;
  createdAt: string;
  chartFileName: string;
  jsonFileName: string;
}

function loadReports(): Report[] {
  try {
    if (!fs.existsSync(REPORTS_INDEX_FILE)) {
      return [];
    }
    const data = fs.readFileSync(REPORTS_INDEX_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading reports:', error);
    return [];
  }
}

function saveReports(reports: Report[]): void {
  try {
    fs.writeFileSync(REPORTS_INDEX_FILE, JSON.stringify(reports, null, 2));
  } catch (error) {
    console.error('Error saving reports:', error);
    throw new Error('Failed to save reports');
  }
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate session token using the new session format
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken.value, 'base64').toString());
      const now = Date.now();
      
      // Check if session is valid and not expired
      if (!sessionData.username || !sessionData.expiresAt || now > sessionData.expiresAt) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Verify username matches
      if (sessionData.username !== ADMIN_USERNAME) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const clientName = formData.get('clientName') as string;
    const generatedDate = formData.get('generatedDate') as string;
    const chartFile = formData.get('chartFile') as File;
    const jsonFile = formData.get('jsonFile') as File;

    // Validate inputs
    if (!clientName || !generatedDate || !chartFile || !jsonFile) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file types
    if (!chartFile.name.endsWith('.png')) {
      return NextResponse.json(
        { success: false, error: 'Chart file must be a PNG image' },
        { status: 400 }
      );
    }

    if (!jsonFile.name.endsWith('.json')) {
      return NextResponse.json(
        { success: false, error: 'Data file must be a JSON file' },
        { status: 400 }
      );
    }

    // Validate JSON content
    try {
      const jsonContent = await jsonFile.text();
      JSON.parse(jsonContent);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON file format' },
        { status: 400 }
      );
    }

    // Generate unique identifiers
    const reportId = uuidv4();
    const token = generateToken();
    const timestamp = Date.now();
    
    const chartFileName = `${token}_chart.png`;
    const jsonFileName = `${token}_data.json`;

    // Save files
    const chartBuffer = Buffer.from(await chartFile.arrayBuffer());
    const jsonBuffer = Buffer.from(await jsonFile.arrayBuffer());

    fs.writeFileSync(path.join(CHARTS_DIR, chartFileName), chartBuffer);
    fs.writeFileSync(path.join(DATA_DIR, jsonFileName), jsonBuffer);

    // Create report record
    const newReport: Report = {
      id: reportId,
      token,
      clientName,
      generatedDate,
      createdAt: new Date().toISOString(),
      chartFileName,
      jsonFileName
    };

    // Save to reports index
    const reports = loadReports();
    reports.push(newReport);
    saveReports(reports);

    return NextResponse.json({
      success: true,
      token,
      reportId,
      message: 'Report generated successfully'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}