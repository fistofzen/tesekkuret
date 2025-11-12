import { HomeHero } from '@/components/home/home-hero';
import TrendingThanks from '@/components/home/trending-thanks';
import { PopularThanks } from '@/components/home/popular-thanks';
import { SuccessStories } from '@/components/home/success-stories';
import { StatsSection } from '@/components/home/stats-section';
import { TopCompaniesList } from '@/components/top/top-companies-list';
import { Footer } from '@/components/layout/footer';
import { prisma } from '@/lib/prisma';

async function getTrendingThanks() {
  try {
    // @ts-expect-error - Prisma type cache issue
    const thanks = await prisma.thanks.findMany({
      // @ts-expect-error - Prisma type cache issue
      where: { isApproved: true },
      take: 10,
      orderBy: [
        { likes: { _count: 'desc' } },
        { comments: { _count: 'desc' } },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        company: {
          select: {
            slug: true,
            name: true,
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

    // Map database data to component format
    return thanks.map((t: typeof thanks[0]) => ({
      id: t.id,
      title: t.text,
      content: t.text,
      thumbnail: t.mediaUrl || undefined,
      createdAt: t.createdAt,
      likes: t._count.likes,
      commentCount: t._count.comments,
      user: {
        ...t.user,
        name: t.user.name || undefined,
        image: t.user.image || undefined,
      },
      company: t.company ? {
        id: t.company.slug,
        name: t.company.name,
        logo: t.company.logoUrl || undefined,
      } : undefined,
    }));
  } catch (error) {
    console.error('Error fetching trending thanks:', error);
    // Return mock data on error
    return [
      {
        id: '1',
        title: 'Fuzul Evde Temizlik Hatası Ve Ödeme Artışı Mağduriyeti',
        content: 'Fuzul Evde Temizlik Hatası Ve Ödeme Artışı Mağduriyeti',
        thumbnail: '/banner1.jpeg',
        createdAt: new Date(),
        likes: 25,
        commentCount: 379,
        user: { id: '1', name: 'Asiye', image: 'https://i.pravatar.cc/150?img=1' },
        company: { id: 'fuzul-ev', name: 'Fuzul Ev', logo: undefined },
      },
      {
        id: '2',
        title: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
        content: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
        thumbnail: undefined,
        createdAt: new Date(),
        likes: 41,
        commentCount: 852,
        user: { id: '2', name: 'Niyazi', image: 'https://i.pravatar.cc/150?img=2' },
        company: { id: 'eminotomotiv', name: 'EminOtomotiv', logo: undefined },
      },
      {
        id: '3',
        title: 'Papara Hesabımdaki Bakiyemi Çekemiyorum',
        content: 'Papara Hesabımdaki Bakiyemi Çekemiyorum',
        thumbnail: undefined,
        createdAt: new Date(),
        likes: 2,
        commentCount: 266,
        user: { id: '3', name: 'Vafa', image: 'https://i.pravatar.cc/150?img=3' },
        company: { id: 'papara', name: 'Papara', logo: undefined },
      },
    ];
  }
}

async function getPopularThanks() {
  try {
    // @ts-expect-error - Prisma type cache issue
    const thanks = await prisma.thanks.findMany({
      take: 5,
      orderBy: [{ likes: { _count: 'desc' } }],
      where: {
        // @ts-expect-error - Prisma type cache issue
        isApproved: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Son 30 gün
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        company: {
          select: {
            id: true,
            slug: true,
            name: true,
            logoUrl: true,
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

    return thanks.map((t: typeof thanks[0]) => ({
      ...t,
      createdAt: t.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching popular thanks:', error);
    return [];
  }
}

async function getTopCompanies() {
  try {
    const companies = await prisma.company.findMany({
      take: 10,
      orderBy: [
        { thanks: { _count: 'desc' } },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        category: true,
        _count: {
          select: {
            thanks: true,
          },
        },
        thanks: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            createdAt: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
        },
      },
    });

    // Calculate total likes for each company
    const companiesWithStats = await Promise.all(
      companies.map(async (company: typeof companies[0]) => {
        const totalLikes = await prisma.like.count({
          where: {
            thanks: {
              companyId: company.id,
            },
          },
        });

        return {
          id: company.id,
          name: company.name,
          slug: company.slug,
          logoUrl: company.logoUrl,
          category: company.category,
          thanksCount: company._count.thanks,
          totalLikeCount: totalLikes,
          lastThanksDate: company.thanks[0]?.createdAt.toISOString() || null,
        };
      })
    );

    return companiesWithStats;
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return [];
  }
}

export default async function Home() {
  const [trending, popular, topCompanies] = await Promise.all([
    getTrendingThanks(),
    getPopularThanks(),
    getTopCompanies(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Hero Section */}
      <HomeHero />

      {/* Gündemdeki Teşekkürler */}
      <TrendingThanks thanks={trending} />

      {/* Çok Konuşulanlar */}
      {popular.length > 0 && <PopularThanks items={popular} />}

 
      {/* İstatistikler - Çözüm Başarısı */}
      <StatsSection />

      {/* En Çok Teşekkür Alan Şirketler */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
              En Çok Teşekkür Alan Şirketler
            </h2>
          </div>
          <p className="text-gray-600 ml-16">
            Müşteri memnuniyetinde öne çıkan markalar
          </p>
        </div>
        <TopCompaniesList companies={topCompanies} />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}



