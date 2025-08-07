import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('file');
    
    if (!fileName) {
      return NextResponse.json({ error: 'File name required' }, { status: 400 });
    }

    const chartsDir = path.join(process.cwd(), 'public', 'reports', 'charts');
    const filePath = path.join(chartsDir, fileName);
    
    // Check if directory exists
    if (!fs.existsSync(chartsDir)) {
      return NextResponse.json({ 
        error: 'Charts directory does not exist',
        path: chartsDir,
        exists: false
      }, { status: 404 });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // List all files in the directory
      const files = fs.readdirSync(chartsDir);
      return NextResponse.json({ 
        error: 'File does not exist',
        requestedFile: fileName,
        filePath: filePath,
        availableFiles: files,
        directoryExists: true
      }, { status: 404 });
    }
    
    // Get file stats
    const stats = fs.statSync(filePath);
    
    return NextResponse.json({
      success: true,
      fileName,
      filePath,
      fileSize: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      publicUrl: `/reports/charts/${fileName}`
    });
    
  } catch (error) {
    console.error('Error checking image:', error);
    return NextResponse.json(
      { error: 'Failed to check image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}