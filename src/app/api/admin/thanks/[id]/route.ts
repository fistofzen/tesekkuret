import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const { action } = await request.json();
    const { id: thanksId } = await params;

    if (action === 'approve') {
      // Approve the thanks
      // @ts-expect-error - Prisma type cache issue
      const updatedThanks = await prisma.thanks.update({
        where: { id: thanksId },
        // @ts-expect-error - Prisma type cache issue
        data: { isApproved: true },
      });

      return NextResponse.json({ 
        success: true, 
        thanks: updatedThanks 
      });
    } else if (action === 'reject') {
      // Delete the thanks
      await prisma.thanks.delete({
        where: { id: thanksId },
      });

      return NextResponse.json({ 
        success: true, 
        deleted: true 
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing thanks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
