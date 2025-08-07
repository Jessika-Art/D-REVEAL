import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sessionManager from '@/lib/sessionManager';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dreveal2024';

// Initialize session manager (this will start the rotation timer)
sessionManager;

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create session data with expiration time (15 minutes)
      const sessionData = {
        username,
        loginTime: Date.now(),
        lastActivity: Date.now(),
        expiresAt: Date.now() + (15 * 60 * 1000) // 15 minutes from now
      };
      
      const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');
      
      // Set cookie
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60, // 15 minutes
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');

    if (sessionToken) {
      try {
        // Parse session data
        const sessionData = JSON.parse(Buffer.from(sessionToken.value, 'base64').toString());
        const now = Date.now();

        // Check if session is valid and not expired
        if (sessionData.username === ADMIN_USERNAME && now < sessionData.expiresAt) {
          // Session is valid, refresh it with new expiration time
          const refreshedSessionData = {
            ...sessionData,
            lastActivity: now,
            expiresAt: now + (15 * 60 * 1000) // Extend by 15 minutes
          };

          const refreshedToken = Buffer.from(JSON.stringify(refreshedSessionData)).toString('base64');
          
          const response = NextResponse.json({ 
            authenticated: true,
            expiresAt: refreshedSessionData.expiresAt,
            timeRemaining: refreshedSessionData.expiresAt - now
          });
          
          // Update cookie with refreshed session
          response.cookies.set('admin-session', refreshedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60, // 15 minutes
          });

          return response;
        }
      } catch (parseError) {
        console.error('Session parse error:', parseError);
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.delete('admin-session');
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Logout failed' },
      { status: 500 }
    );
  }
}