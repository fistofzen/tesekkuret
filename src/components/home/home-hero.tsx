'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import AuthModal from '@/components/auth/auth-modal';
import { useUser } from '@/hooks/use-user';

export function HomeHero() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useUser();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
              <span className="text-lg">💝</span>
              <span>teşekkürvar</span>
            </div>

            {/* Heading */}
            <h1 className="mb-4 text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Çözüm için
              <br />
              <span className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                Teşekkürvar
              </span>
            </h1>

            <p className="mb-8 text-lg text-gray-600 sm:text-xl">
              Memnun kaldığın şirketleri, markaları ve ürünleri paylaş. Pozitif
              deneyimlerin başkalarına ilham versin.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mb-8">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Marka, model, ürün ara"
                  className="w-full rounded-full border-2 border-gray-200 bg-white px-6 py-4 pl-12 text-gray-900 transition focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 font-semibold text-white transition hover:from-pink-600 hover:to-rose-600"
                >
                  Ara
                </button>
              </div>
            </form>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/tesekkur-yaz')}
                className="rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-rose-600 hover:shadow-xl"
              >
                + Teşekkür Yaz
              </button>
              <button
                onClick={() => router.push('/sirketler')}
                className="rounded-full border-2 border-pink-300 bg-white px-8 py-3 font-semibold text-pink-600 transition hover:border-pink-400 hover:bg-pink-50"
              >
                Şirketleri Keşfet
              </button>
              {!isAuthenticated && !isLoading && (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="rounded-full border-2 border-gray-300 bg-white px-8 py-3 font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                >
                  Giriş Yap / Üye Ol
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Photo Grid with Real Images */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-3 gap-3">
              {/* Top Row */}
              <div className="col-span-2 h-48 overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/banner1.jpeg"
                  alt="Mutlu müşteri"
                  width={400}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg">
                <div className="flex h-full items-center justify-center text-6xl">
                  ⭐
                </div>
              </div>

              {/* Middle Row */}
              <div className="h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-teal-400 shadow-lg">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-2 text-5xl">✨</div>
                    <p className="px-2 text-xs font-semibold text-white">
                      Harika Deneyimler
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-2 h-48 overflow-hidden rounded-2xl shadow-lg">
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Image
                    src="/banner1.jpeg"
                    alt="Gülen müşteri"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <p className="text-sm font-semibold text-white">
                      Pozitif Geri Bildirimler
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="col-span-2 h-48 overflow-hidden rounded-2xl shadow-lg">
                <div className="relative h-full w-full">
                  <Image
                    src="/banner1.jpeg"
                    alt="Mutlu insan"
                    width={400}
                    height={300}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/40 to-orange-500/40"></div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg">
                      <span className="text-2xl">🎉</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 shadow-lg">
                <div className="flex h-full items-center justify-center text-6xl">
                  💖
                </div>
              </div>
            </div>

            {/* Floating Decorations */}
            <div className="absolute -right-4 -top-4 text-6xl opacity-20">⭐</div>
            <div className="absolute -bottom-4 -left-4 text-6xl opacity-20">
              💝
            </div>

            {/* Decorative Circles */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-pink-200 to-purple-200 opacity-20 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="register"
      />
    </div>
  );
}


