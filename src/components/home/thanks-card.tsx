'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { HeartIcon, ChatBubbleLeftIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ThanksCardProps {
  thanks: {
    id: string;
    text: string;
    mediaUrl: string | null;
    mediaType: 'image' | 'video' | null;
    likeCount: number;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
    company: {
      id: string;
      name: string;
      slug: string;
      logoUrl: string | null;
      category: string;
    };
    _count: {
      likes: number;
      comments: number;
    };
  };
  isLiked?: boolean;
  onLike?: (thanksId: string) => void;
}

export function ThanksCard({ thanks, isLiked = false, onLike }: ThanksCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(thanks.likeCount);

  const handleLike = async () => {
    if (!onLike) return;

    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

    try {
      onLike(thanks.id);
    } catch {
      // Revert on error
      setLiked(!newLiked);
      setLikeCount((prev) => (newLiked ? prev - 1 : prev + 1));
    }
  };

  // Truncate text to 3 lines (approximately 200 chars)
  const displayText = thanks.text.length > 200 ? thanks.text.slice(0, 200) + '...' : thanks.text;

  const timeAgo = formatDistanceToNow(new Date(thanks.createdAt), {
    addSuffix: true,
    locale: tr,
  });

  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          {/* User Avatar */}
          <Link href={`/kullanici/${thanks.user.id}`} className="flex-shrink-0">
            {thanks.user.image ? (
              <Image
                src={thanks.user.image}
                alt={thanks.user.name || 'User'}
                width={40}
                height={40}
                className="rounded-full ring-2 ring-gray-100"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-sm font-semibold text-white ring-2 ring-gray-100">
                {thanks.user.name?.[0]?.toUpperCase() || thanks.user.email?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </Link>

          {/* User Info & Company */}
          <div className="min-w-0 flex-1">
            <Link
              href={`/kullanici/${thanks.user.id}`}
              className="block truncate text-sm font-semibold text-gray-900 hover:text-blue-600"
            >
              {thanks.user.name || thanks.user.email}
            </Link>
            <Link
              href={`/sirketler/${thanks.company.slug}`}
              className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-600"
            >
              {thanks.company.logoUrl && (
                <Image
                  src={thanks.company.logoUrl}
                  alt={thanks.company.name}
                  width={16}
                  height={16}
                  className="rounded"
                />
              )}
              <span className="truncate font-medium">{thanks.company.name}</span>
              <span className="text-gray-400">·</span>
              <span className="truncate">{thanks.company.category}</span>
            </Link>
          </div>
        </div>

        {/* Time */}
        <time className="flex-shrink-0 text-xs text-gray-500" dateTime={thanks.createdAt}>
          {timeAgo}
        </time>
      </div>

      {/* Media */}
      {thanks.mediaUrl && (
        <Link href={`/tesekkurler/${thanks.id}`} className="block">
          {thanks.mediaType === 'image' ? (
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <Image
                src={thanks.mediaUrl}
                alt="Teşekkür görseli"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          ) : thanks.mediaType === 'video' ? (
            <div className="relative aspect-video w-full overflow-hidden bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/90 p-4 shadow-lg backdrop-blur-sm transition-transform group-hover:scale-110">
                  <VideoCameraIcon className="h-8 w-8 text-gray-900" aria-hidden="true" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          ) : null}
        </Link>
      )}

      {/* Content */}
      <div className="p-4 pt-3">
        <Link href={`/tesekkurler/${thanks.id}`} className="block">
          <p className="text-sm leading-relaxed text-gray-800 line-clamp-3">{displayText}</p>
        </Link>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4 border-t border-gray-100 pt-3">
          <button
            onClick={handleLike}
            disabled={!onLike}
            className="group/like flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-red-600 disabled:cursor-not-allowed"
            aria-label={liked ? 'Beğeniyi geri al' : 'Beğen'}
          >
            {liked ? (
              <HeartSolidIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
            ) : (
              <HeartIcon className="h-5 w-5 transition-transform group-hover/like:scale-110" aria-hidden="true" />
            )}
            <span className={liked ? 'text-red-600' : ''}>{likeCount}</span>
          </button>

          <Link
            href={`/tesekkurler/${thanks.id}#comments`}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
            aria-label="Yorumlar"
          >
            <ChatBubbleLeftIcon className="h-5 w-5" aria-hidden="true" />
            <span>{thanks._count.comments}</span>
          </Link>

          {/* Media Type Indicator */}
          {thanks.mediaType && (
            <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
              {thanks.mediaType === 'image' ? (
                <PhotoIcon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <VideoCameraIcon className="h-4 w-4" aria-hidden="true" />
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
