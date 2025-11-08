'use client';

import Image from '@/components/ui/image';
import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

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

interface TopCompaniesSectionProps {
  companies: Company[];
}

export function TopCompaniesSection({ companies }: TopCompaniesSectionProps) {
  // Take top 8 companies for the grid
  const displayCompanies = companies.slice(0, 8);

  return (
    <section className="py-12 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Markalar için
          </h2>
          <p className="text-gray-600 text-lg">
            Müşteri memnuniyetinde öne çıkan şirketler
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {displayCompanies.map((company) => (
            <Link
              key={company.id}
              href={`/sirketler/${company.slug}`}
              className="group bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all p-6 flex flex-col items-center justify-center gap-3"
            >
              {/* Logo */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                {company.logoUrl ? (
                  <Image
                    src={company.logoUrl}
                    alt={company.name}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform"
                    sizes="80px"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-10 h-10 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Company Name */}
              <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2 group-hover:text-purple-600 transition-colors">
                {company.name}
              </h3>

              {/* Stats */}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-purple-600">
                  {company.thanksCount} teşekkür
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/sirketler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg"
          >
            Tüm Şirketleri Gör
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
