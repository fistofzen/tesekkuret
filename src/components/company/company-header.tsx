'use client';

import Image from '@/components/ui/image';
import Link from 'next/link';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

interface CompanyHeaderProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    category: string;
    stats: {
      totalThanks: number;
      recentThanks: number;
    };
  };
}

export function CompanyHeader({ company }: CompanyHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Left: Logo + Info */}
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.name}
                  width={80}
                  height={80}
                  className="rounded-xl border-2 border-gray-100 bg-white p-2 shadow-sm"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-purple-50">
                  <BuildingOfficeIcon className="h-10 w-10 text-gray-400" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{company.name}</h1>
              <p className="mt-1 text-sm font-medium text-gray-600">{company.category}</p>

              {/* Stats */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">{company.stats.totalThanks.toLocaleString('tr-TR')}</span>
                  <span className="text-gray-600">toplam teşekkür</span>
                </div>
                <span className="text-gray-300">·</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-blue-600">{company.stats.recentThanks.toLocaleString('tr-TR')}</span>
                  <span className="text-gray-600">son 30 günde</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: CTA Button */}
          <div className="flex-shrink-0">
            <Link
              href={`/tesekkur-yaz?sirket=${company.slug}`}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110"
            >
              💙 Bu Şirkete Teşekkür Et
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
