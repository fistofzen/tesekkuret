import { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchPage } from '@/components/search/search-page';

export const metadata: Metadata = {
  title: 'Ara | Teşekkürvar',
  description: 'Şirket ve teşekkür ara. Aradığınız deneyimleri keşfedin.',
};

export default function SearchRoute() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>}>
      <SearchPage />
    </Suspense>
  );
}
