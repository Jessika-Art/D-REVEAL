import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Force dynamic rendering since we read files from filesystem
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;
    
    // Validate filename to prevent directory traversal
    if (!filename || filename.includes('..') || !filename.endsWith('.png')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }
    
    const chartsDir = path.join(process.cwd(), 'public', 'reports', 'charts');
    const filePath = path.join(chartsDir, filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 });
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
    
  } catch (error) {
    console.error('Error serving chart:', error);
    return NextResponse.json(
      { error: 'Failed to serve chart' },
      { status: 500 }
    );
  }
}