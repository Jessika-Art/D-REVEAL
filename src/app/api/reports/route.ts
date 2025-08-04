import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Get admin username from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');
const REPORTS_INDEX_FILE = path.join(REPORTS_DIR, 'index.json');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Ensure reports index file exists
if (!fs.existsSync(REPORTS_INDEX_FILE)) {
  fs.writeFileSync(REPORTS_INDEX_FILE, JSON.stringify([]));
}

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

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate session token
    try {
      const tokenData = Buffer.from(sessionToken.value, 'base64').toString();
      const [username, timestamp] = tokenData.split(':');
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 1000; // 24 hours in milliseconds

      if (username !== ADMIN_USERNAME || tokenAge >= maxAge) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = loadReports();
    
    return NextResponse.json({
      success: true,
      reports: reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}