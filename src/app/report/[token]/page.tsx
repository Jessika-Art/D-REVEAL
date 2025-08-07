import { notFound } from 'next/navigation';
import ForecastReport from '@/components/ForecastReport';
import { getReportByToken } from '@/lib/database';

async function fetchReportData(dataUrl: string) {
  try {
    // If it's a Supabase URL, fetch directly
    if (dataUrl.startsWith('http')) {
      const response = await fetch(dataUrl);
      if (!response.ok) return null;
      return await response.json();
    } else {
      // Local file path - read from filesystem
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'public', dataUrl);
      if (!fs.existsSync(filePath)) return null;
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading report data:', error);
    return null;
  }
}

export default async function ReportPage({ params }: { params: { token: string } }) {
  const { token } = params;
  
  // Find the report by token
  const report = await getReportByToken(token);
  
  if (!report) {
    notFound();
  }

  // Load the report data
  const reportData = await fetchReportData(report.dataUrl || `/reports/data/${report.jsonFileName}`);
  
  if (!reportData) {
    notFound();
  }

  // Use chart URL from database or construct local path
  const chartUrl = report.chartUrl || `/reports/charts/${report.chartFileName}`;

  return (
    <ForecastReport
      clientName={report.clientName}
      generatedDate={report.generatedDate}
      chartUrl={chartUrl}
      reportData={reportData}
    />
  );
}