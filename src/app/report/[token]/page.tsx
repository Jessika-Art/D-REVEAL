import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import ForecastReport from '@/components/ForecastReport';

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');
const REPORTS_INDEX_FILE = path.join(REPORTS_DIR, 'index.json');

interface Report {
  id: string;
  token: string;
  clientName: string;
  generatedDate: string;
  createdAt: string;
  chartFileName: string;
  jsonFileName: string;
}

interface ReportData {
  agent: {
    name: string;
    version: string;
    model: string;
  };
  forecast: {
    asset: string;
    direction: string;
    timeframe: string;
    duration: string;
    confidence: number;
  };
  technical_analysis: {
    [key: string]: {
      trend: string;
      support: number;
      resistance: number;
      indicators: {
        rsi: number;
        macd: string;
        bollinger: string;
      };
    };
  };
  macro_fundamentals: {
    economic_outlook: string;
    market_sentiment: string;
    risk_factors: string[];
  };
  economic_calendar: Array<{
    date: string;
    event: string;
    impact: string;
    forecast: string;
  }>;
  strategic_notes: {
    entry_strategy: string;
    risk_management: string;
    exit_strategy: string;
  };
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

function loadReportData(jsonFileName: string): ReportData | null {
  try {
    const dataPath = path.join(process.cwd(), 'public', 'reports', 'data', jsonFileName);
    if (!fs.existsSync(dataPath)) {
      return null;
    }
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading report data:', error);
    return null;
  }
}

export default function ReportPage({ params }: { params: { token: string } }) {
  const { token } = params;
  
  // Find the report by token
  const reports = loadReports();
  const report = reports.find(r => r.token === token);
  
  if (!report) {
    notFound();
  }

  // Load the report data
  const reportData = loadReportData(report.jsonFileName);
  
  if (!reportData) {
    notFound();
  }

  // Construct the chart URL using the API route
  const chartUrl = `/api/charts/${report.chartFileName}`;

  return (
    <ForecastReport
      clientName={report.clientName}
      generatedDate={report.generatedDate}
      chartUrl={chartUrl}
      reportData={reportData}
    />
  );
}

// Generate static params for better performance (optional)
export async function generateStaticParams() {
  try {
    const reports = loadReports();
    return reports.map((report) => ({
      token: report.token,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}