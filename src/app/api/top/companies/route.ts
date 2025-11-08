import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/top/companies - Top 100 companies by thanks count in last 30 days
export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get top companies with aggregated stats
    const topCompanies = await prisma.company.findMany({
      where: {
        thanks: {
          some: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        category: true,
        thanks: {
          where: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            id: true,
            createdAt: true,
            likeCount: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Get latest thanks for lastThanksDate
        },
        _count: {
          select: {
            thanks: {
              where: {
                createdAt: {
                  gte: thirtyDaysAgo,
                },
              },
            },
          },
        },
      },
      take: 100,
      orderBy: {
        thanks: {
          _count: 'desc',
        },
      },
    });

    // Calculate total like count for each company
    const companiesWithStats = await Promise.all(
      topCompanies.map(async (company: typeof topCompanies[0]) => {
        const totalLikes = await prisma.thanks.aggregate({
          where: {
            companyId: company.id,
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          _sum: {
            likeCount: true,
          },
        });

        return {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logoUrl: company.logoUrl,
          category: company.category,
          thanksCount: company._count.thanks,
          totalLikeCount: totalLikes._sum.likeCount || 0,
          lastThanksDate: company.thanks[0]?.createdAt || null,
        };
      })
    );

    // Sort by thanks count (should already be sorted, but ensuring)
    companiesWithStats.sort((a, b) => b.thanksCount - a.thanksCount);

    return NextResponse.json({
      companies: companiesWithStats,
      period: {
        start: thirtyDaysAgo,
        end: new Date(),
        days: 30,
      },
    });
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return NextResponse.json(
      { error: 'En iyi şirketler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
