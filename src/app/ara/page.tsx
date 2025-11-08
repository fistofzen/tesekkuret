import { Metadata } from 'next';
import { SearchPage } from '@/components/search/search-page';

export const metadata: Metadata = {
  title: 'Ara | Teşekkürvar',
  description: 'Şirket ve teşekkür ara. Aradığınız deneyimleri keşfedin.',
};

export default function SearchRoute() {
  return <SearchPage />;
}
