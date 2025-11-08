import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { commentTextSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET /api/thanks/[id]/comments - List comments
const listCommentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(100).default(20),
});

export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { id: thanksId } = await params;
    const { searchParams } = new URL(req.url);

    const queryParams = listCommentsSchema.parse({
      page: searchParams.get('page') || '1',
      size: searchParams.get('size') || '20',
    });

    const { page, size } = queryParams;
    const skip = (page - 1) * size;

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

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where: { thanksId },
        skip,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      }),
      prisma.comment.count({ where: { thanksId } }),
    ]);

    return NextResponse.json({
      comments,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Yorumlar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/thanks/[id]/comments - Create comment (auth required)
const createCommentSchema = z.object({
  text: commentTextSchema,
});

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

    // Rate limiting
    const rateLimitResult = checkRateLimit(
      session.user.id,
      'comment:create',
      RATE_LIMITS.COMMENT_CREATE
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Çok fazla yorum gönderdiniz. Lütfen bir süre bekleyin.',
          resetAt: rateLimitResult.resetAt,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetAt.toString(),
          },
        }
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

    const body = await req.json();
    const data = createCommentSchema.parse(body);

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        userId: session.user.id,
        thanksId,
        text: data.text,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Yorum oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
