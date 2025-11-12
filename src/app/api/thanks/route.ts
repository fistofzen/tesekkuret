import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { thanksTextSchema } from '@/lib/validation';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';

// GET /api/thanks - List thanks with filters and cursor pagination
const listThanksSchema = z.object({
  mode: z.enum(['latest', 'popular']).default('latest'),
  companySlug: z.string().optional(),
  media: z.enum(['image', 'video']).optional(),
  q: z.string().optional(), // Search query
  take: z.coerce.number().int().positive().max(50).default(20),
  cursor: z.string().optional(), // Format: createdAt_id
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = listThanksSchema.parse({
      mode: searchParams.get('mode') || 'latest',
      companySlug: searchParams.get('companySlug') || undefined,
      media: searchParams.get('media') || undefined,
      q: searchParams.get('q') || undefined,
      take: searchParams.get('take') || '20',
      cursor: searchParams.get('cursor') || undefined,
    });

    const { mode, companySlug, media, q, take, cursor } = params;

    // Build where clause
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    if (companySlug) {
      where.company = { slug: companySlug };
    }

    if (media) {
      where.mediaType = media;
    }

    // Search in text, company name, or user name
    if (q && q.trim()) {
      where.OR = [
        { text: { contains: q, mode: 'insensitive' } },
        { company: { name: { contains: q, mode: 'insensitive' } } },
        { user: { name: { contains: q, mode: 'insensitive' } } },
      ];
    }

    // Parse cursor
    let cursorObj: { createdAt: Date; id: string } | undefined;
    if (cursor) {
      const [createdAtStr, id] = cursor.split('_');
      if (createdAtStr && id) {
        cursorObj = { createdAt: new Date(createdAtStr), id };
      }
    }

    // Build orderBy
    const orderBy =
      mode === 'popular'
        ? [{ likeCount: 'desc' as const }, { createdAt: 'desc' as const }]
        : [{ createdAt: 'desc' as const }];

    // Fetch thanks
    const thanks = await prisma.thanks.findMany({
      where,
      take: take + 1, // Fetch one extra to check if there's a next page
      ...(cursorObj && {
        cursor: { id: cursorObj.id },
        skip: 1, // Skip the cursor
      }),
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            category: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    // Check if there's a next page
    const hasNextPage = thanks.length > take;
    const items = hasNextPage ? thanks.slice(0, take) : thanks;

    // Generate next cursor
    let nextCursor: string | undefined;
    if (hasNextPage && items.length > 0) {
      const lastItem = items[items.length - 1];
      nextCursor = `${lastItem.createdAt.toISOString()}_${lastItem.id}`;
    }

    return NextResponse.json({
      thanks: items,
      pagination: {
        nextCursor,
        hasNextPage,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error fetching thanks:', error);
    return NextResponse.json(
      { error: 'Teşekkürler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/thanks - Create new thanks post (auth required)
const createThanksSchema = z.object({
  companyId: z.string().cuid('Geçersiz şirket ID').optional(),
  targetUserId: z.string().cuid('Geçersiz kullanıcı ID').optional(),
  text: thanksTextSchema,
  mediaUrl: z.union([z.string().url(), z.literal(''), z.null()]).optional(),
  mediaType: z.enum(['image', 'video']).optional().nullable(),
}).refine((data) => data.companyId || data.targetUserId, {
  message: 'Bir şirket veya kullanıcı seçmelisiniz',
  path: ['companyId'],
});

export async function POST(req: Request) {
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
      'thanks:create',
      RATE_LIMITS.THANKS_CREATE
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Çok fazla teşekkür gönderdiniz. Lütfen bir süre bekleyin.',
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

    const body = await req.json();
    const data = createThanksSchema.parse(body);

    // Normalize empty string to null
    const mediaUrl = data.mediaUrl && data.mediaUrl.trim() !== '' ? data.mediaUrl : null;

    // Validate mediaUrl and mediaType together - only require mediaType if mediaUrl is provided
    if (mediaUrl && !data.mediaType) {
      return NextResponse.json(
        { error: 'Medya URL\'si varken medya tipi belirtilmelidir' },
        { status: 400 }
      );
    }

    // Check if company exists (if companyId provided)
    if (data.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: data.companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: 'Şirket bulunamadı' },
          { status: 404 }
        );
      }
    }

    // Check if target user exists (if targetUserId provided)
    if (data.targetUserId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: data.targetUserId },
      });

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Kullanıcı bulunamadı' },
          { status: 404 }
        );
      }

      // Cannot thank yourself
      if (data.targetUserId === session.user.id) {
        return NextResponse.json(
          { error: 'Kendinize teşekkür edemezsiniz' },
          { status: 400 }
        );
      }
    }

    // Create thanks
    const thanks = await prisma.thanks.create({
      data: {
        userId: session.user.id,
        companyId: data.companyId || undefined,
        targetUserId: data.targetUserId || undefined,
        text: data.text,
        mediaUrl: mediaUrl,
        mediaType: data.mediaType || null,
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
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            category: true,
          },
        },
      },
    });

    return NextResponse.json(thanks, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating thanks:', error);
    return NextResponse.json(
      { error: 'Teşekkür oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
