import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  return NextResponse.json({
    session,
    hasSession: !!session,
    hasUser: !!session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
  });
}
