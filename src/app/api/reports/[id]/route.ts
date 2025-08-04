import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

// Get admin username from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');
const REPORTS_INDEX_FILE = path.join(REPORTS_DIR, 'index.json');
const CHARTS_DIR = path.join(process.cwd(), 'public', 'reports', 'charts');
const DATA_DIR = path.join(process.cwd(), 'public', 'reports', 'data');

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const reportId = params.id;
    const reports = loadReports();
    const reportIndex = reports.findIndex(report => report.id === reportId);

    if (reportIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Report not found' },
        { status: 404 }
      );
    }

    const report = reports[reportIndex];

    // Delete associated files
    try {
      const chartPath = path.join(CHARTS_DIR, report.chartFileName);
      const dataPath = path.join(DATA_DIR, report.jsonFileName);

      if (fs.existsSync(chartPath)) {
        fs.unlinkSync(chartPath);
      }

      if (fs.existsSync(dataPath)) {
        fs.unlinkSync(dataPath);
      }
    } catch (fileError) {
      console.error('Error deleting files:', fileError);
      // Continue with report deletion even if file deletion fails
    }

    // Remove report from index
    reports.splice(reportIndex, 1);
    saveReports(reports);

    return NextResponse.json({
      success: true,
      message: 'Report deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete report' },
      { status: 500 }
    );
  }
}