import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// GET /api/companies/[slug]/thanks - Get company thanks with filters
const querySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().positive().max(50).default(20),
  mediaType: z.enum(['image', 'video', 'all']).default('all'),
  sortBy: z.enum(['recent', 'popular']).default('recent'),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    
    const query = querySchema.parse({
      cursor: searchParams.get('cursor') || undefined,
      limit: searchParams.get('limit') || '20',
      mediaType: searchParams.get('mediaType') || 'all',
      sortBy: searchParams.get('sortBy') || 'recent',
    });

    // Find company
    const company = await prisma.company.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Şirket bulunamadı' },
        { status: 404 }
      );
    }

    // Build where clause
    const where: {
      companyId: string;
      mediaType?: { not: null } | { equals: 'image' | 'video' };
    } = {
      companyId: company.id,
    };

    if (query.mediaType === 'image') {
      where.mediaType = { equals: 'image' };
    } else if (query.mediaType === 'video') {
      where.mediaType = { equals: 'video' };
    }

    // Build orderBy
    const orderBy =
      query.sortBy === 'popular'
        ? [{ likeCount: 'desc' as const }, { createdAt: 'desc' as const }]
        : [{ createdAt: 'desc' as const }];

    // Fetch thanks with cursor pagination
    const thanks = await prisma.thanks.findMany({
      where,
      take: query.limit + 1, // Take one extra to check if there's a next page
      skip: query.cursor ? 1 : 0, // Skip the cursor item
      cursor: query.cursor ? { id: query.cursor } : undefined,
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
    const hasMore = thanks.length > query.limit;
    const items = hasMore ? thanks.slice(0, -1) : thanks;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return NextResponse.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error fetching company thanks:', error);
    return NextResponse.json(
      { error: 'Teşekkürler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
