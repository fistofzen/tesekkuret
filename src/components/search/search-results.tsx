'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { ThanksCard } from '@/components/home/thanks-card';

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

interface SearchResultsProps {
  companies: Company[];
  thanks: Thanks[];
  isLoading: boolean;
  activeTab: 'companies' | 'thanks';
  onTabChange: (tab: 'companies' | 'thanks') => void;
}

export function SearchResults({ companies, thanks, isLoading, activeTab, onTabChange }: SearchResultsProps) {
  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="rounded-xl bg-white p-2 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => onTabChange('companies')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'companies'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Şirketler ({companies.length})
          </button>
          <button
            onClick={() => onTabChange('thanks')}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'thanks' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Teşekkürler ({thanks.length})
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
        </div>
      )}

      {/* Companies Tab */}
      {!isLoading && activeTab === 'companies' && (
        <div className="space-y-3">
          {companies.length > 0 ? (
            companies.map((company) => (
              <Link
                key={company.id}
                href={`/sirketler/${company.slug}`}
                className="group block rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {company.logoUrl ? (
                      <Image
                        src={company.logoUrl}
                        alt={company.name}
                        width={56}
                        height={56}
                        className="rounded-lg border border-gray-200 bg-white p-2"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                        <BuildingOfficeIcon className="h-7 w-7 text-gray-400" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Company Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-600">{company.category}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {company._count.thanks.toLocaleString('tr-TR')} teşekkür
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-sm">
              <p className="text-gray-600">Şirket bulunamadı</p>
            </div>
          )}
        </div>
      )}

      {/* Thanks Tab */}
      {!isLoading && activeTab === 'thanks' && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {thanks.length > 0 ? (
            thanks.map((item) => <ThanksCard key={item.id} thanks={item} />)
          ) : (
            <div className="col-span-full rounded-xl bg-white p-12 text-center shadow-sm">
              <p className="text-gray-600">Teşekkür bulunamadı</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
