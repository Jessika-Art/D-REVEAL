import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import sessionManager from '@/lib/sessionManager';

// Get credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dreveal2024';

// Initialize session manager (this will start the rotation timer)
sessionManager;

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Create a simple session token
      const sessionToken = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      
      // Set cookie
      const response = NextResponse.json({ success: true, message: 'Authentication successful' });
      response.cookies.set('admin-session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
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
      // Simple validation - check if token exists and is not too old
      const tokenData = Buffer.from(sessionToken.value, 'base64').toString();
      const [username, timestamp] = tokenData.split(':');
      const tokenAge = Date.now() - parseInt(timestamp);
      const maxAge = 60 * 60 * 24 * 1000; // 24 hours in milliseconds

      if (username === ADMIN_USERNAME && tokenAge < maxAge) {
        return NextResponse.json({ authenticated: true });
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