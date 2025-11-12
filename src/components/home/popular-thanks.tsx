'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from '@/components/ui/image';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface PopularThanks {
  id: string;
  text: string;
  mediaUrl: string | null;
  mediaType: 'image' | 'video' | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  company: {
    id: string;
    slug: string;
    name: string;
    logoUrl: string | null;
  } | null;
  _count: {
    likes: number;
    comments: number;
  };
}

interface PopularThanksProps {
  items: PopularThanks[];
}

export function PopularThanks({ items }: PopularThanksProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  if (items.length === 0) return null;

  const current = items[currentIndex];

  return (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Çok Konuşulanlar
          </h2>
          <p className="text-gray-600">En çok beğenilen ve yorum alan teşekkürler</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main Card */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="grid gap-0 lg:grid-cols-2">
              {/* Left - Media or Gradient */}
              <div className="relative h-64 lg:h-auto">
                {current.mediaUrl && current.mediaType === 'image' ? (
                  <Image
                    src={current.mediaUrl}
                    alt="Teşekkür görseli"
                    fill
                    className="object-cover"
                  />
                ) : current.mediaUrl && current.mediaType === 'video' ? (
                  <video
                    src={current.mediaUrl}
                    className="h-full w-full object-cover"
                    controls
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500">
                    <div className="flex h-full items-center justify-center p-8 text-center">
                      <div>
                        <div className="mb-4 text-6xl">🌟</div>
                        <p className="text-lg font-semibold text-white">
                          Harika bir deneyim paylaşıldı!
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Content */}
              <div className="flex flex-col justify-between p-8 lg:p-12">
                {/* User & Company */}
                <div>
                  <div className="mb-6 flex items-center gap-4">
                    {/* User Avatar */}
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-pink-400 to-rose-400">
                      {current.user.image ? (
                        <Image
                          src={current.user.image}
                          alt={current.user.name || 'Kullanıcı'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl font-semibold text-white">
                          {current.user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                      )}
                    </div>

                    {/* Company */}
                    {current.company && (
                      <div className="flex-1">
                        <Link
                          href={`/sirketler/${current.company.slug}`}
                          className="group flex items-center gap-2"
                        >
                          <div className="relative h-8 w-8 overflow-hidden rounded bg-gray-100">
                            {current.company.logoUrl ? (
                              <Image
                                src={current.company.logoUrl}
                                alt={current.company.name}
                                fill
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs font-bold text-gray-400">
                                {current.company.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="font-semibold text-gray-900 group-hover:text-pink-600">
                            {current.company.name}
                          </span>
                        </Link>
                        <p className="text-sm text-gray-500">
                          {current.user.name || 'Anonim'} •{' '}
                          {formatDistanceToNow(new Date(current.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    {current.text}
                  </p>
                </div>

                {/* Stats & CTA */}
                <div>
                  <div className="mb-6 flex items-center gap-6">
                    <div className="flex items-center gap-2 text-pink-600">
                      <span className="text-2xl">❤️</span>
                      <span className="text-2xl font-bold">
                        {current._count.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-2xl">💬</span>
                      <span className="text-2xl font-bold">
                        {current._count.comments}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/tesekkur/${current.id}`}
                    className="inline-flex items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 font-semibold text-white transition hover:from-pink-600 hover:to-rose-600"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
                aria-label="Önceki"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-700" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:bg-gray-50"
                aria-label="Sonraki"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Indicators */}
          {items.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-gradient-to-r from-pink-500 to-rose-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`${index + 1}. slayta git`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
