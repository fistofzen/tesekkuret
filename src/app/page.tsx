import { HomeHero } from '@/components/home/home-hero';
import TrendingThanks from '@/components/home/trending-thanks';
import { PopularThanks } from '@/components/home/popular-thanks';
import { SuccessStories } from '@/components/home/success-stories';
import { StatsSection } from '@/components/home/stats-section';
import { HomePageFeed } from '@/components/home/home-page-feed';
import { prisma } from '@/lib/prisma';

async function getTrendingThanks() {
  try {
    const thanks = await prisma.thanks.findMany({
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

    // Mock data if empty (for demo purposes)
    if (thanks.length === 0) {
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
          company: { id: 'fuzul-ev', name: 'Fuzul Ev', logo: null },
        },
        {
          id: '2',
          title: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
          content: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
          thumbnail: null,
          createdAt: new Date(),
          likes: 41,
          commentCount: 852,
          user: { id: '2', name: 'Niyazi', image: 'https://i.pravatar.cc/150?img=2' },
          company: { id: 'eminotomotiv', name: 'EminOtomotiv', logo: null },
        },
        {
          id: '3',
          title: 'Papara Hesabımdaki Bakiyemi Çekemiyorum, Sürekli Günlük Limit Hatası Alıyorum',
          content: 'Papara Hesabımdaki Bakiyemi Çekemiyorum, Sürekli Günlük Limit Hatası Alıyorum',
          thumbnail: null,
          createdAt: new Date(),
          likes: 2,
          commentCount: 266,
          user: { id: '3', name: 'Vafa', image: 'https://i.pravatar.cc/150?img=3' },
          company: { id: 'papara', name: 'Papara', logo: null },
        },
        {
          id: '4',
          title: 'Sıfır Kilometre Araçta Yaygın Paslanma Ve Boya Kabarması Sorunu',
          content: 'Sıfır Kilometre Araçta Yaygın Paslanma Ve Boya Kabarması Sorunu',
          thumbnail: '/banner1.jpeg',
          createdAt: new Date(),
          likes: 11,
          commentCount: 283,
          user: { id: '4', name: 'Muhammed', image: 'https://i.pravatar.cc/150?img=4' },
          company: { id: 'chery', name: 'Chery', logo: null },
        },
        {
          id: '5',
          title: 'Yetkili Serviste Yapılan Bakım Hatası Sonrası Aracım Garanti Dışı Bırakıldı',
          content: 'Yetkili Serviste Yapılan Bakım Hatası Sonrası Aracım Garanti Dışı Bırakıldı',
          thumbnail: '/banner1.jpeg',
          createdAt: new Date(),
          likes: 2,
          commentCount: 228,
          user: { id: '5', name: 'Muhammed', image: 'https://i.pravatar.cc/150?img=5' },
          company: { id: 'akgun-otomotiv', name: 'Akgün Otomotiv (Sakarya)', logo: null },
        },
      ];
    }

    // Map database data to component format
    return thanks.map((t: typeof thanks[0]) => ({
      id: t.id,
      title: t.text,
      content: t.text,
      thumbnail: t.mediaUrl,
      createdAt: t.createdAt,
      likes: t._count.likes,
      commentCount: t._count.comments,
      user: t.user,
      company: t.company ? {
        id: t.company.slug,
        name: t.company.name,
        logo: t.company.logoUrl,
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
        company: { id: 'fuzul-ev', name: 'Fuzul Ev', logo: null },
      },
      {
        id: '2',
        title: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
        content: 'Eminevim Kura Çekimlerinde Haksızlık Ve Mağduriyet',
        thumbnail: null,
        createdAt: new Date(),
        likes: 41,
        commentCount: 852,
        user: { id: '2', name: 'Niyazi', image: 'https://i.pravatar.cc/150?img=2' },
        company: { id: 'eminotomotiv', name: 'EminOtomotiv', logo: null },
      },
      {
        id: '3',
        title: 'Papara Hesabımdaki Bakiyemi Çekemiyorum',
        content: 'Papara Hesabımdaki Bakiyemi Çekemiyorum',
        thumbnail: null,
        createdAt: new Date(),
        likes: 2,
        commentCount: 266,
        user: { id: '3', name: 'Vafa', image: 'https://i.pravatar.cc/150?img=3' },
        company: { id: 'papara', name: 'Papara', logo: null },
      },
    ];
  }
}

async function getPopularThanks() {
  try {
    const thanks = await prisma.thanks.findMany({
      take: 5,
      orderBy: [{ likes: { _count: 'desc' } }],
      where: {
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

export default async function Home() {
  const [trending, popular] = await Promise.all([
    getTrendingThanks(),
    getPopularThanks(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HomeHero />

      {/* Gündemdeki Teşekkürler */}
      <TrendingThanks thanks={trending} />

      {/* Çok Konuşulanlar */}
      {popular.length > 0 && <PopularThanks items={popular} />}

      {/* Çok Konuşulanlar - Kayan Kartlar */}
      <SuccessStories />

      {/* İstatistikler - Çözüm Başarısı */}
      <StatsSection />

      {/* Ana Feed */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">
          Tüm Teşekkürler
        </h2>
        <HomePageFeed />
      </div>
    </div>
  );
}



