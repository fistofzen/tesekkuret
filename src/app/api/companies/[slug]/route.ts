import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/companies/[slug] - Get company details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Get company with stats
    const company = await prisma.company.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        category: true,
        createdAt: true,
        _count: {
          select: {
            thanks: true,
          },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Şirket bulunamadı' },
        { status: 404 }
      );
    }

    // Get thanks count for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentThanksCount = await prisma.thanks.count({
      where: {
        companyId: company.id,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      ...company,
      stats: {
        totalThanks: company._count.thanks,
        recentThanks: recentThanksCount,
      },
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json(
      { error: 'Şirket bilgileri yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
