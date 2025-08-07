import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAllReports } from '@/lib/database';

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic';

// Get admin username from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin-session');
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate session token using the new session format
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken.value, 'base64').toString());
      const now = Date.now();
      
      // Check if session is valid and not expired
      if (!sessionData.username || !sessionData.expiresAt || now > sessionData.expiresAt) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Verify username matches
      if (sessionData.username !== ADMIN_USERNAME) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reports = await getAllReports();
    
    return NextResponse.json({
      success: true,
      reports: reports.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}