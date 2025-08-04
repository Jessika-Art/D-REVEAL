import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'waitlist-submissions.json');

// Ensure data directory exists
function ensureDataDirectory() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Read existing submissions
function readSubmissions() {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading submissions:', error);
    return [];
  }
}

// Write submissions to file
function writeSubmissions(submissions: any[]) {
  ensureDataDirectory();
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(submissions, null, 2));
  } catch (error) {
    console.error('Error writing submissions:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Add timestamp and ID to the submission
    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...formData
    };

    // Read existing submissions
    const submissions = readSubmissions();
    
    // Add new submission
    submissions.push(submission);
    
    // Write back to file
    writeSubmissions(submissions);

    return NextResponse.json({ 
      success: true, 
      message: 'Submission saved successfully',
      id: submission.id 
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check authentication for GET requests (viewing submissions)
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate session token using the new session format
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken.value, 'base64').toString());
      const now = Date.now();
      
      // Check if session is valid and not expired
      if (!sessionData.username || !sessionData.expiresAt || now > sessionData.expiresAt) {
        return NextResponse.json(
          { success: false, message: 'Invalid or expired session' },
          { status: 401 }
        );
      }

      // Verify username matches
      if (sessionData.username !== (process.env.ADMIN_USERNAME || 'admin')) {
        return NextResponse.json(
          { success: false, message: 'Invalid session' },
          { status: 401 }
        );
      }

      // Session is valid, return submissions
      const submissions = readSubmissions();
      return NextResponse.json({ 
        success: true, 
        submissions,
        count: submissions.length 
      });
    } catch (parseError) {
      // If parsing fails, session format is invalid
      return NextResponse.json(
        { success: false, message: 'Invalid session format' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error reading submissions:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to read submissions' },
      { status: 500 }
    );
  }
}