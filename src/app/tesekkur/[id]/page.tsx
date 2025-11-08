import { notFound } from 'next/navigation';
import Image from '@/components/ui/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { MessageCircle, Calendar, Building2 } from 'lucide-react';
import LikeButton from '@/components/thanks/like-button';
import CommentSection from '@/components/thanks/comment-section';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getThanks(id: string) {
  try {
    const thanks = await prisma.thanks.findUnique({
      where: { id },
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
            name: true,
            slug: true,
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

    return thanks;
  } catch (error) {
    console.error('Error fetching thanks:', error);
    return null;
  }
}

export default async function ThanksDetailPage({ params }: PageProps) {
  const { id } = await params;
  const thanks = await getThanks(id);

  if (!thanks) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-purple-100 overflow-hidden mb-6">
          {/* User Info */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href={`/profil/${thanks.user.id}`} className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-purple-100 hover:ring-purple-200 transition-all">
                  <Image
                    src={thanks.user.image || 'https://i.pravatar.cc/150?img=1'}
                    alt={thanks.user.name || 'Kullanıcı'}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </Link>
                <div>
                  <Link href={`/profil/${thanks.user.id}`} className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors">
                    {thanks.user.name || 'Anonim Kullanıcı'}
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={thanks.createdAt.toISOString()}>
                      {new Date(thanks.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              </div>

              {thanks.company && (
                <Link
                  href={`/sirket/${thanks.company.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full hover:from-pink-200 hover:to-purple-200 transition-all border-2 border-pink-200"
                >
                  {thanks.company.logo && (
                    <div className="relative w-6 h-6">
                      <Image
                        src={thanks.company.logo}
                        alt={thanks.company.name}
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                  )}
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <span className="font-semibold text-purple-700">
                    {thanks.company.name}
                  </span>
                </Link>
              )}
            </div>
          </div>

          {/* Thanks Content */}
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              {thanks.title}
            </h1>

            {/* Media Content */}
            {thanks.mediaUrl && (
              <div className="mb-6 rounded-xl overflow-hidden ring-4 ring-purple-100">
                {thanks.mediaType === 'IMAGE' ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={thanks.mediaUrl}
                      alt={thanks.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 896px) 100vw, 896px"
                      priority
                    />
                  </div>
                ) : thanks.mediaType === 'VIDEO' ? (
                  <video
                    src={thanks.mediaUrl}
                    controls
                    className="w-full aspect-video"
                    preload="metadata"
                  >
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                ) : null}
              </div>
            )}

            {/* Text Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {thanks.text}
              </p>
            </div>

            {/* Engagement Stats */}
            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-100">
              <LikeButton
                thanksId={thanks.id}
                initialLikes={thanks._count.likes}
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-700">
                  {thanks._count.comments}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection thanksId={thanks.id} />
      </div>
    </div>
  );
}
