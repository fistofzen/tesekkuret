'use client';

import { useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface SuccessStory {
  id: string;
  userName: string;
  userAvatar: string;
  companyName: string;
  title: string;
  responseCount: number;
  badge?: string;
}

const successStories: SuccessStory[] = [
  {
    id: '1',
    userName: 'Halime',
    userAvatar: 'H',
    companyName: 'Adalet Bakanlığı',
    title: 'Adalet Bakanlığı Cezaevi E-Görüş Uygulamasında Sürekli Timeout...',
    responseCount: 11,
    badge: 'Yorum',
  },
  {
    id: '2',
    userName: 'Muhammed',
    userAvatar: 'M',
    companyName: 'Akgün Otomotiv (Sakarya)',
    title: 'Yetkili Serviste Yapılan Bakım Hatası Sonrası Aracım Garanti...',
    responseCount: 2228,
  },
  {
    id: '3',
    userName: 'Ayşe',
    userAvatar: 'A',
    companyName: 'Migros',
    title: 'Harika Müşteri Hizmetleri ve Kaliteli Ürünler',
    responseCount: 856,
  },
  {
    id: '4',
    userName: 'Mehmet',
    userAvatar: 'M',
    companyName: 'Turkcell',
    title: 'İnternet Hızı Sorunu Hızlıca Çözüldü',
    responseCount: 432,
    badge: 'Çözüldü',
  },
];

export function SuccessStories() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Çok Konuşulanlar
            </h2>
            <p className="mt-2 text-gray-600">
              En çok etkileşim alan teşekkürler
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="rounded-full bg-white p-3 text-gray-700 shadow-md transition hover:bg-gray-50 hover:shadow-lg"
              aria-label="Sola kaydır"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="rounded-full bg-white p-3 text-gray-700 shadow-md transition hover:bg-gray-50 hover:shadow-lg"
              aria-label="Sağa kaydır"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {successStories.map((story, index) => (
            <div
              key={story.id}
              className="group relative flex-none w-[380px] cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition hover:shadow-2xl"
              style={{
                background:
                  index % 2 === 0
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              }}
            >
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
                <div className="absolute top-0 left-0 h-48 w-48 rounded-full bg-white blur-2xl"></div>
              </div>

              {/* Content */}
              <div className="relative p-6">
                {/* User Info */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-bold text-purple-600">
                    {story.userAvatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{story.userName}</p>
                    {story.badge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                        {story.badge === 'Yorum' ? '💬' : '✅'} {story.responseCount} {story.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 line-clamp-2 text-lg font-semibold text-white">
                  {story.title}
                </h3>

                {/* Company Badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <span className="text-sm font-medium text-white">
                    🏢 {story.companyName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CSS to hide scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
}
