'use client';

import { useState, useEffect } from 'react';
import Image from '@/components/ui/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface UserProfileProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    userType: string;
    profession: string | null;
    workArea: string | null;
    createdAt: Date;
    _count: {
      thanksReceived: number;
      thanks: number;
      followers: number;
      following: number;
    };
    thanksReceived: Array<{
      id: string;
      text: string;
      createdAt: Date;
      user: {
        id: string;
        name: string | null;
        image: string | null;
      };
      _count: {
        likes: number;
        comments: number;
      };
    }>;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isOwnProfile = session?.user?.id === user.id;

  // Check if current user is following this user
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!session?.user?.id || isOwnProfile) return;

      try {
        const res = await fetch(`/api/users/${user.id}/follow`);
        if (res.ok) {
          const data = await res.json();
          setIsFollowing(data.isFollowing);
        }
      } catch (error) {
        console.error('Failed to check follow status:', error);
      }
    };

    checkFollowStatus();
  }, [session?.user?.id, user.id, isOwnProfile]);

  const handleFollow = async () => {
    if (!session) {
      router.push('/giris');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/follow`, {
        method: isFollowing ? 'DELETE' : 'POST',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Bir hata oluştu');
      }

      setIsFollowing(!isFollowing);
      toast.success(isFollowing ? 'Takipten çıkıldı' : 'Takip edildi');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendAppreciation = () => {
    if (!session) {
      router.push('/giris');
      return;
    }
    router.push(`/tesekkur-yaz?kullanici=${user.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-5xl">
                    {user.name?.[0]?.toUpperCase() || '👤'}
                  </div>
                )}
              </div>
              {user.userType === 'professional' && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ PRO
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.name || 'İsimsiz Kullanıcı'}</h1>
              {user.profession && (
                <p className="text-xl opacity-90 mb-2">
                  {user.profession}
                  {user.workArea && ` • ${user.workArea}`}
                </p>
              )}
              {user.bio && <p className="text-lg opacity-80 max-w-2xl">{user.bio}</p>}
              <div className="flex items-center gap-4 mt-4 justify-center md:justify-start">
                {user.location && (
                  <span className="flex items-center gap-1">
                    📍 {user.location}
                  </span>
                )}
                {user.website && (
                  <a
                    href={user.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:underline"
                  >
                    🔗 Website
                  </a>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwnProfile && (
              <div className="flex gap-3">
                <button
                  onClick={handleFollow}
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    isFollowing
                      ? 'bg-white/20 hover:bg-white/30'
                      : 'bg-white text-purple-600 hover:scale-105'
                  }`}
                >
                  {isFollowing ? '✓ Takip Ediliyor' : '+ Takip Et'}
                </button>
                <button
                  onClick={handleSendAppreciation}
                  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 rounded-xl font-bold hover:scale-105 transition-all shadow-lg"
                >
                  💙 Teşekkür Et
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{user._count.thanksReceived}</div>
              <div className="text-sm opacity-80">Teşekkür Aldı</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{user._count.thanks}</div>
              <div className="text-sm opacity-80">Teşekkür Etti</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{user._count.followers}</div>
              <div className="text-sm opacity-80">Takipçi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{user._count.following}</div>
              <div className="text-sm opacity-80">Takip</div>
            </div>
          </div>
        </div>
      </div>

      {/* Thanks Received */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          💙 Aldığı Teşekkürler ({user._count.thanksReceived})
        </h2>

        {user.thanksReceived.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
            <div className="text-6xl mb-4">😊</div>
            <p className="text-gray-600">Henüz teşekkür almamış</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {user.thanksReceived.map((thanks) => (
              <div
                key={thanks.id}
                className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:border-purple-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {thanks.user.image ? (
                      <Image
                        src={thanks.user.image}
                        alt={thanks.user.name || 'User'}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">
                        👤
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-gray-900">
                        {thanks.user.name || 'İsimsiz'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        • {new Date(thanks.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{thanks.text}</p>
                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        ❤️ {thanks._count.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        💬 {thanks._count.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
