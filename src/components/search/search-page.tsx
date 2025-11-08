'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { SearchResults } from '@/components/search/search-results';

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  _count: {
    thanks: number;
  };
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

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [thanks, setThanks] = useState<Thanks[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'companies' | 'thanks'>('companies');

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setCompanies([]);
      setThanks([]);
      return;
    }

    setIsLoading(true);

    try {
      // Search companies and thanks in parallel
      const [companiesRes, thanksRes] = await Promise.all([
        fetch(`/api/companies?q=${encodeURIComponent(searchQuery)}&size=20`),
        fetch(`/api/thanks?q=${encodeURIComponent(searchQuery)}&limit=20`),
      ]);

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json();
        setCompanies(companiesData.companies || []);
      }

      if (thanksRes.ok) {
        const thanksData = await thanksRes.json();
        setThanks(thanksData.items || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Perform search when query param changes
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery, performSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Update URL with query param
    router.push(`/ara?q=${encodeURIComponent(query)}`);
    performSearch(query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">🔍 Ara</h1>
          
          {/* Search Input */}
          <form onSubmit={handleSearch} className="relative">
            <MagnifyingGlassIcon
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Şirket adı veya teşekkür metni ara..."
              className="block w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Results */}
        {query.trim() && (
          <SearchResults
            companies={companies}
            thanks={thanks}
            isLoading={isLoading}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}

        {/* Empty State */}
        {!query.trim() && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">Aramak için bir şirket adı veya teşekkür metni girin</p>
          </div>
        )}
      </div>
    </div>
  );
}
