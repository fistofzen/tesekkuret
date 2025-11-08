'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ThanksCard } from '@/components/home/thanks-card';

interface FilterState {
  mode: 'latest' | 'popular';
  media?: 'image' | 'video';
  companySlug?: string;
}

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

interface InfiniteFeedProps {
  filters: FilterState;
}

export function InfiniteFeed({ filters }: InfiniteFeedProps) {
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
          mode: filters.mode,
          take: '20',
        });

        if (filters.media) {
          params.append('media', filters.media);
        }

        if (filters.companySlug) {
          params.append('companySlug', filters.companySlug);
        }

        if (cursor) {
          params.append('cursor', cursor);
        }

        const res = await fetch(`/api/thanks?${params.toString()}`);

        if (!res.ok) {
          throw new Error('Failed to fetch thanks');
        }

        const data = await res.json();

        setThanks((prev) => (cursor ? [...prev, ...data.items] : data.items));
        setNextCursor(data.nextCursor);
        setHasMore(data.hasNextPage);
      } catch (error) {
        console.error('Error fetching thanks:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [filters]
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
    <div>
      {/* Feed Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {thanks?.map((item) => (
          <ThanksCard key={item.id} thanks={item} onLike={handleLike} />
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (!thanks || thanks.length === 0) && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && thanks && thanks.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">
            {filters.media === 'image'
              ? 'Görselli teşekkür bulunamadı.'
              : filters.media === 'video'
                ? 'Videolu teşekkür bulunamadı.'
                : 'Henüz teşekkür yok. İlk teşekkürü siz yazın!'}
          </p>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      {hasMore && <div ref={loadMoreRef} className="h-20" />}

      {/* Loading More */}
      {isLoading && thanks && thanks.length > 0 && (
        <div className="flex items-center justify-center py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* End Message */}
      {!hasMore && thanks && thanks.length > 0 && (
        <div className="py-8 text-center text-sm text-gray-500">
          Tüm teşekkürler yüklendi
        </div>
      )}
    </div>
  );
}
