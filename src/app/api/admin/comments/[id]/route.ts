import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = await params;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action } = await request.json();

    if (action === 'approve') {
      // Approve comment
      await prisma.comment.update({
        where: { id },
        data: { isApproved: true },
      });

      return NextResponse.json({ message: 'Comment approved' }, { status: 200 });
    } else if (action === 'reject') {
      // Delete comment
      await prisma.comment.delete({
        where: { id },
      });

      return NextResponse.json({ message: 'Comment rejected' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Comment action error:', error);
    return NextResponse.json(
      { error: 'Failed to process comment action' },
      { status: 500 }
    );
  }
}
