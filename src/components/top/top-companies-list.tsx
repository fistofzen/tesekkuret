'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { BuildingOfficeIcon, HeartIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
  thanksCount: number;
  totalLikeCount: number;
  lastThanksDate: string | null;
}

interface TopCompaniesListProps {
  companies: Company[];
}

export function TopCompaniesList({ companies }: TopCompaniesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(companies.map((c) => c.category)));
    return ['all', ...unique.sort()];
  }, [companies]);

  // Filter companies by category
  const filteredCompanies = useMemo(() => {
    if (selectedCategory === 'all') return companies;
    return companies.filter((c) => c.category === selectedCategory);
  }, [companies, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-900">
          Kategori Filtresi
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-2 pr-8 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
        >
          <option value="all">Tüm Kategoriler ({companies.length})</option>
          {categories.slice(1).map((category) => {
            const count = companies.filter((c) => c.category === category).length;
            return (
              <option key={category} value={category}>
                {category} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Companies List */}
      <div className="space-y-3">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <Link
              key={company.id}
              href={`/sirketler/${company.slug}`}
              className="group block rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                {/* Rank */}
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                      : index === 1
                        ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white'
                        : index === 2
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {index + 1}
                </div>

                {/* Logo */}
                <div className="flex-shrink-0">
                  {company.logoUrl ? (
                    <Image
                      src={company.logoUrl}
                      alt={company.name}
                      width={48}
                      height={48}
                      className="rounded-lg border border-gray-200 bg-white p-1"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                      <BuildingOfficeIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600">
                    {company.name}
                  </h3>
                  <p className="text-sm text-gray-600">{company.category}</p>
                </div>

                {/* Stats */}
                <div className="hidden flex-shrink-0 gap-6 sm:flex">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                      <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
                      {company.thanksCount.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-500">Teşekkür</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                      <HeartIcon className="h-4 w-4" aria-hidden="true" />
                      {company.totalLikeCount.toLocaleString('tr-TR')}
                    </div>
                    <div className="text-xs text-gray-500">Beğeni</div>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                      <ClockIcon className="h-4 w-4" aria-hidden="true" />
                      {company.lastThanksDate
                        ? formatDistanceToNow(new Date(company.lastThanksDate), {
                            addSuffix: true,
                            locale: tr,
                          })
                        : '-'}
                    </div>
                    <div className="text-xs text-gray-500">Son Teşekkür</div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="flex flex-col gap-1 text-right sm:hidden">
                  <div className="text-sm font-semibold text-blue-600">
                    {company.thanksCount.toLocaleString('tr-TR')} teşekkür
                  </div>
                  <div className="text-xs text-gray-500">
                    {company.totalLikeCount.toLocaleString('tr-TR')} beğeni
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <p className="text-gray-600">Bu kategoride şirket bulunamadı.</p>
          </div>
        )}
      </div>
    </div>
  );
}
