import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/thanks/[id]/like - Toggle like (auth required)
export async function POST(req: Request, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { id: thanksId } = await params;

    // Check if thanks exists
    const thanks = await prisma.thanks.findUnique({
      where: { id: thanksId },
    });

    if (!thanks) {
      return NextResponse.json(
        { error: 'Teşekkür bulunamadı' },
        { status: 404 }
      );
    }

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_thanksId: {
          userId: session.user.id,
          thanksId,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove like and decrement count
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.thanks.update({
          where: { id: thanksId },
          data: {
            likeCount: {
              decrement: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({
        liked: false,
        likeCount: thanks.likeCount - 1,
      });
    } else {
      // Like: Add like and increment count
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId: session.user.id,
            thanksId,
          },
        }),
        prisma.thanks.update({
          where: { id: thanksId },
          data: {
            likeCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return NextResponse.json({
        liked: true,
        likeCount: thanks.likeCount + 1,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Beğeni işlemi sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}
