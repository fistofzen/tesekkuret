import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/top/users - Top 100 users by total likes received in last 30 days
export async function GET() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get users with their thanks from last 30 days
    const usersWithThanks = await prisma.user.findMany({
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
        email: true,
        image: true,
        thanks: {
          where: {
            createdAt: {
              gte: thirtyDaysAgo,
            },
          },
          select: {
            id: true,
            likeCount: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    // Calculate total likes for each user
    const usersWithStats = usersWithThanks.map((user: typeof usersWithThanks[0]) => {
      const totalLikes = user.thanks.reduce((sum: number, thanks: typeof user.thanks[0]) => sum + thanks.likeCount, 0);
      const thanksCount = user.thanks.length;
      const lastThanksDate = user.thanks[0]?.createdAt || null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        totalLikes,
        thanksCount,
        lastThanksDate,
      };
    });

    // Sort by total likes and take top 100
    usersWithStats.sort((a: typeof usersWithStats[0], b: typeof usersWithStats[0]) => b.totalLikes - a.totalLikes);
    const topUsers = usersWithStats.slice(0, 100);

    return NextResponse.json({
      users: topUsers,
      period: {
        start: thirtyDaysAgo,
        end: new Date(),
        days: 30,
      },
    });
  } catch (error) {
    console.error('Error fetching top users:', error);
    return NextResponse.json(
      { error: 'En iyi kullanıcılar yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
