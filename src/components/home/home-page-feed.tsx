'use client';

import { useState } from 'react';
import { FeedFilters } from '@/components/home/feed-filters';
import { InfiniteFeed } from '@/components/home/infinite-feed';

export function HomePageFeed() {
  const [filters, setFilters] = useState<{
    mode: 'latest' | 'popular';
    media?: 'image' | 'video';
    companySlug?: string;
  }>({
    mode: 'latest',
  });

  return (
    <>
      <div className="mb-6">
        <FeedFilters onFilterChange={setFilters} />
      </div>
      <InfiniteFeed filters={filters} />
    </>
  );
}
