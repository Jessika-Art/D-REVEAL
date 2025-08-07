import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { saveWaitlistSubmission, getWaitlistSubmissions, deleteWaitlistSubmission } from '@/lib/database';
import { sendTelegramNotification } from '@/lib/telegram';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Add timestamp and ID to the submission
    const submission = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...formData
    };

    // Save using database function
    await saveWaitlistSubmission(submission);

    // Send Telegram notification (don't block the response if it fails)
    sendTelegramNotification(submission).catch(error => {
      console.error('Failed to send Telegram notification:', error);
    });

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
      const submissions = await getWaitlistSubmissions();
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

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication for DELETE requests
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate session token
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

      // Get the submission ID from the request
      const { searchParams } = new URL(request.url);
      const id = searchParams.get('id');

      if (!id) {
        return NextResponse.json(
          { success: false, message: 'Submission ID is required' },
          { status: 400 }
        );
      }

      // Delete the submission
      await deleteWaitlistSubmission(id);

      return NextResponse.json({ 
        success: true, 
        message: 'Submission deleted successfully' 
      });
    } catch (parseError) {
      // If parsing fails, session format is invalid
      return NextResponse.json(
        { success: false, message: 'Invalid session format' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete submission' },
      { status: 500 }
    );
  }
}