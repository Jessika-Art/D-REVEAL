import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sessionManager from '@/lib/sessionManager';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    
    if (sessionData.username !== ADMIN_USERNAME || sessionData.expires < Date.now()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Get rotation info
    const rotationInfo = sessionManager.getRotationInfo();
    
    return NextResponse.json({
      status: 'authenticated',
      sessionRotation: rotationInfo,
      message: 'Session will auto-rotate every 15 minutes, logging out all users'
    });
  } catch (error) {
    console.error('Session status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin-session');
    
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
    
    if (sessionData.username !== ADMIN_USERNAME || sessionData.expires < Date.now()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    const { action } = await request.json();
    
    if (action === 'force-rotation') {
      sessionManager.forceRotation();
      return NextResponse.json({ 
        message: 'Session secret rotated manually. All users will be logged out.',
        rotationInfo: sessionManager.getRotationInfo()
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Session action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}