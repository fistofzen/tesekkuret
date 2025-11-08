import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, 
  ThumbsUp, 
  MessageSquare, 
  Calendar,
  Plus
} from 'lucide-react';

interface CompanyPageProps {
  params: {
    slug: string;
  };
}

async function getCompany(slug: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            thanks: true,
            followers: true,
          },
        },
        thanks: {
          take: 50,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        },
      },
    });

    return company;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Company Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start gap-6">
            {/* Company Logo */}
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex-shrink-0 shadow-md">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                  <span className="text-3xl font-bold text-purple-600">
                    {company.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <p className="text-gray-600 mb-4">
                {company.category}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold text-gray-900">{company._count.thanks}</span>
                  {' '}Teşekkür
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{company._count.followers}</span>
                  {' '}Takipçi
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Takip Et
              </button>
              <Link
                href="/tesekkur-yaz"
                className="px-6 py-2.5 border-2 border-purple-500 text-purple-600 font-medium rounded-full hover:bg-purple-50 transition-colors"
              >
                Teşekkür Yaz
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Thanks List */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Teşekkürler
          </h2>
          <p className="text-gray-600">
            {company._count.thanks} teşekkür paylaşıldı
          </p>
        </div>

        <div className="space-y-4">
          {company.thanks.map((thank: typeof company.thanks[0]) => (
            <Link
              key={thank.id}
              href={`/tesekkur/${thank.id}`}
              className="block bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all p-6"
            >
              {/* User Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  {thank.user.image ? (
                    <Image
                      src={thank.user.image}
                      alt={thank.user.name || 'User'}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {thank.user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      {thank.user.name || 'Anonim Kullanıcı'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(thank.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-900 line-clamp-3">
                  {thank.text}
                </p>
              </div>

              {/* Thumbnail */}
              {thank.mediaUrl && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4">
                  <Image
                    src={thank.mediaUrl}
                    alt="Thank you image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{thank._count.likes}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thank._count.comments}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        {company.thanks.length === 50 && (
          <div className="mt-8 text-center">
            <button className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors">
              Daha Fazla Yükle
            </button>
          </div>
        )}

        {/* No Thanks Message */}
        {company.thanks.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <User className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz teşekkür yok
            </h3>
            <p className="text-gray-600 mb-6">
              {company.name} için ilk teşekkürü siz paylaşın!
            </p>
            <Link
              href="/tesekkur-yaz"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Teşekkür Yaz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
