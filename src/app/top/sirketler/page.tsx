import { Metadata } from 'next';
import { TopCompaniesList } from '@/components/top/top-companies-list';

export const metadata: Metadata = {
  title: 'Top 100 Şirketler | Teşekkürvar',
  description: 'Son 30 günde en çok teşekkür alan şirketler. En iyi müşteri deneyimi sunan şirketleri keşfedin.',
};

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

async function getTopCompanies(): Promise<Company[]> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/top/companies`, {
    cache: 'no-store', // Always fetch fresh data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top companies');
  }

  const data = await res.json();
  return data.companies;
}

export default async function TopCompaniesPage() {
  const companies = await getTopCompanies();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">🏆 Top 100 Şirketler</h1>
          <p className="mt-2 text-gray-600">Son 30 günde en çok teşekkür alan şirketler</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
            📅 Son 30 Gün
          </div>
        </div>

        {/* List */}
        <TopCompaniesList companies={companies} />
      </div>
    </div>
  );
}
