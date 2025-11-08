import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  Share2,
  Search
} from 'lucide-react';

async function getTopCompanies() {
  try {
    const companies = await prisma.company.findMany({
      take: 100,
      include: {
        _count: {
          select: {
            thanks: true,
            followers: true,
          },
        },
      },
      orderBy: {
        thanks: {
          _count: 'desc',
        },
      },
    });

    // Calculate trend and percentage (mock for now - you can add trend tracking later)
    return companies.map((company: typeof companies[0], index: number) => ({
      ...company,
      rank: index + 1,
      thanksCount: company._count.thanks,
      followersCount: company._count.followers,
      // Mock trend data - you can track this with a separate table
      trendChange: Math.floor(Math.random() * 10) - 3, // -3 to +6
      percentage: (Math.random() * 10 + 40).toFixed(1), // 40% to 50%
    }));
  } catch (error) {
    console.error('Error fetching top companies:', error);
    return [];
  }
}

export default async function SirketlerPage() {
  const companies = await getTopCompanies();

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-12 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
            <h1 className="text-5xl font-bold">
              Trend<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500">100</span>
            </h1>
            <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 rounded-full border border-orange-200">
              <span className="text-sm font-semibold text-orange-700">🔥 Popüler</span>
            </div>
          </div>
          <p className="text-gray-700 mb-6 font-medium">
            Artan ziyaret oranları ve popülaritesiyle bugün trend olan markaları takip edin!
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
            <input
              type="text"
              placeholder="Marka, model, ürün ara"
              className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-purple-200 rounded-full focus:border-pink-400 focus:ring-4 focus:ring-pink-200/50 outline-none transition-all shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        {/* Companies Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-purple-200">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-purple-100 to-pink-100 border-b-2 border-purple-200 text-sm font-bold text-gray-700">
            <div className="col-span-1"></div>
            <div className="col-span-4">Marka</div>
            <div className="col-span-3">Trend</div>
            <div className="col-span-2">Ziyaret Artışı</div>
            <div className="col-span-2 text-center">Önceki Sıralama</div>
          </div>

          {/* Companies List */}
          <div className="divide-y divide-gray-100">
            {companies.map((company: typeof companies[0]) => (
              <Link
                key={company.id}
                href={`/sirket/${company.slug}`}
                className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group border-b border-purple-100/50"
              >
                {/* Rank */}
                <div className="col-span-1 flex items-center">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                    {company.rank}.
                  </span>
                </div>

                {/* Company Info */}
                <div className="col-span-4 flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        fill
                        className="object-contain p-1"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                        <span className="text-lg font-bold text-purple-600">
                          {company.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {company.category}
                    </p>
                  </div>
                </div>

                {/* Trend Chart (Mini) */}
                <div className="col-span-3 flex items-center">
                  <div className="w-full h-12">
                    {/* Simple trend line - you can use a chart library for real charts */}
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 40"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,30 Q25,20 50,15 T100,10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-emerald-500"
                      />
                    </svg>
                  </div>
                </div>

                {/* Percentage */}
                <div className="col-span-2 flex items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    % {company.percentage}
                  </span>
                </div>

                {/* Ranking Change */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  {company.trendChange !== 0 ? (
                    <>
                      <span className={`text-sm font-semibold ${getTrendColor(company.trendChange)}`}>
                        {Math.abs(company.trendChange)}
                      </span>
                      {getTrendIcon(company.trendChange)}
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Toplam {companies.length} şirket listelendi • 
            Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
          </p>
        </div>
      </div>

      {/* Share Button */}
      <button className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110">
        <Share2 className="w-6 h-6" />
      </button>
    </div>
  );
}
