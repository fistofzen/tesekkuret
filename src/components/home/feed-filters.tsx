'use client';

import { useState, useEffect } from 'react';
import { FunnelIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

interface FeedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  mode: 'latest' | 'popular';
  media?: 'image' | 'video';
  companySlug?: string;
}

export function FeedFilters({ onFilterChange }: FeedFiltersProps) {
  const [mode, setMode] = useState<'latest' | 'popular'>('latest');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [companySearch, setCompanySearch] = useState('');
  const [companies, setCompanies] = useState<Array<{ slug: string; name: string }>>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);

  // Search companies with debounce
  useEffect(() => {
    if (companySearch.length <= 1) {
      return;
    }

    const timer = setTimeout(() => {
      fetch(`/api/companies?q=${encodeURIComponent(companySearch)}&size=10`)
        .then((res) => res.json())
        .then((data) => {
          setCompanies(data.companies || []);
          setShowCompanyDropdown(true);
        })
        .catch(() => {
          setCompanies([]);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [companySearch]);

  // Notify parent of filter changes
  useEffect(() => {
    const filters: FilterState = {
      mode,
      ...(mediaFilter !== 'all' && { media: mediaFilter }),
      ...(selectedCompany && { companySlug: selectedCompany }),
    };
    onFilterChange(filters);
  }, [mode, mediaFilter, selectedCompany, onFilterChange]);

  const handleCompanySelect = (company: { slug: string; name: string }) => {
    setSelectedCompany(company.slug);
    setCompanySearch(company.name);
    setShowCompanyDropdown(false);
  };

  const handleClearCompany = () => {
    setSelectedCompany(null);
    setCompanySearch('');
    setCompanies([]);
    setShowCompanyDropdown(false);
  };

  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Mode Tabs */}
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            <div className="inline-flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setMode('latest')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'latest'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="En son teşekkürler"
              >
                Son
              </button>
              <button
                onClick={() => setMode('popular')}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  mode === 'popular'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Popüler teşekkürler"
              >
                Popüler
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Media Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setMediaFilter(mediaFilter === 'image' ? 'all' : 'image')}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  mediaFilter === 'image'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Sadece görselli teşekkürler"
                aria-pressed={mediaFilter === 'image'}
              >
                <PhotoIcon className="h-4 w-4" aria-hidden="true" />
                Görselli
              </button>
              <button
                onClick={() => setMediaFilter(mediaFilter === 'video' ? 'all' : 'video')}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  mediaFilter === 'video'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                aria-label="Sadece videolu teşekkürler"
                aria-pressed={mediaFilter === 'video'}
              >
                <VideoCameraIcon className="h-4 w-4" aria-hidden="true" />
                Videolu
              </button>
            </div>

            {/* Company Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                onFocus={() => companySearch.length > 1 && setShowCompanyDropdown(true)}
                placeholder="Şirket filtrele..."
                className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label="Şirkete göre filtrele"
              />
              {selectedCompany && (
                <button
                  onClick={handleClearCompany}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-200 p-1 text-gray-600 hover:bg-gray-300"
                  aria-label="Şirket filtresini temizle"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Company Dropdown */}
              {showCompanyDropdown && companies.length > 0 && (
                <div className="absolute top-full z-20 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                  {companies.map((company) => (
                    <button
                      key={company.slug}
                      onClick={() => handleCompanySelect(company)}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      {company.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
