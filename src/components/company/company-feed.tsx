'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { PhotoIcon, VideoCameraIcon, FireIcon, ClockIcon } from '@heroicons/react/24/outline';
import { ThanksCard } from '@/components/home/thanks-card';

interface CompanyFeedProps {
  companySlug: string;
}

type MediaFilter = 'all' | 'image' | 'video';
type SortFilter = 'recent' | 'popular';

interface Thanks {
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
}

export function CompanyFeed({ companySlug }: CompanyFeedProps) {
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>('all');
  const [sortFilter, setSortFilter] = useState<SortFilter>('recent');
  const [thanks, setThanks] = useState<Thanks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const fetchThanks = useCallback(
    async (cursor: string | null = null) => {
      try {
        setIsLoading(true);

        const params = new URLSearchParams({
          limit: '20',
          mediaType: mediaFilter,
          sortBy: sortFilter,
        });

        if (cursor) {
          params.append('cursor', cursor);
        }

        const res = await fetch(`/api/companies/${companySlug}/thanks?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch thanks');
        }

        const data = await res.json();

        setThanks((prev) => (cursor ? [...prev, ...data.items] : data.items));
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error('Error fetching thanks:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [companySlug, mediaFilter, sortFilter]
  );

  // Reset and fetch on filter change
  useEffect(() => {
    setThanks([]);
    setNextCursor(null);
    setHasMore(true);
    fetchThanks(null);
  }, [fetchThanks]);

  // Infinite scroll with Intersection Observer
  useEffect(() => {
    if (!hasMore || isLoading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoading && nextCursor) {
          fetchThanks(nextCursor);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, nextCursor, fetchThanks]);

  const handleLike = async (thanksId: string) => {
    try {
      const res = await fetch(`/api/thanks/${thanksId}/like`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to like');
      }

      // Update local state
      setThanks((prev) =>
        prev.map((t) =>
          t.id === thanksId
            ? {
                ...t,
                likeCount: t.likeCount + 1,
              }
            : t
        )
      );
    } catch (error) {
      console.error('Error liking thanks:', error);
      throw error;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          {/* Sort Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setSortFilter('recent')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                sortFilter === 'recent'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ClockIcon className="h-4 w-4" aria-hidden="true" />
              En Son
            </button>
            <button
              onClick={() => setSortFilter('popular')}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                sortFilter === 'popular'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FireIcon className="h-4 w-4" aria-hidden="true" />
              Popüler
            </button>
          </div>

          {/* Media Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMediaFilter('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mediaFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setMediaFilter('image')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mediaFilter === 'image'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <PhotoIcon className="h-4 w-4" aria-hidden="true" />
              Görselli
            </button>
            <button
              onClick={() => setMediaFilter('video')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                mediaFilter === 'video'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <VideoCameraIcon className="h-4 w-4" aria-hidden="true" />
              Videolu
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {thanks.map((item) => (
          <ThanksCard key={item.id} thanks={item} onLike={handleLike} />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && thanks.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && thanks.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">
            {mediaFilter === 'all'
              ? 'Henüz bu şirkete teşekkür yapılmamış.'
              : mediaFilter === 'image'
                ? 'Görselli teşekkür bulunamadı.'
                : 'Videolu teşekkür bulunamadı.'}
          </p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && <div ref={loadMoreRef} className="h-20" />}

      {/* Loading More */}
      {isLoading && thanks.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}
    </div>
  );
}
