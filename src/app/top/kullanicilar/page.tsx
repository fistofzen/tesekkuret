import { Metadata } from 'next';
import { TopUsersList } from '@/components/top/top-users-list';

export const metadata: Metadata = {
  title: 'Top 100 Kullanıcılar | Teşekkürvar',
  description: 'Son 30 günde en çok beğeni alan kullanıcılar. En değerli teşekkür paylaşımlarını yapan kullanıcıları keşfedin.',
};

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  totalLikes: number;
  thanksCount: number;
  lastThanksDate: string | null;
}

async function getTopUsers(): Promise<User[]> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/top/users`, {
    cache: 'no-store', // Always fetch fresh data
  });

  if (!res.ok) {
    throw new Error('Failed to fetch top users');
  }

  const data = await res.json();
  return data.users;
}

export default async function TopUsersPage() {
  const users = await getTopUsers();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">🌟 Top 100 Kullanıcılar</h1>
          <p className="mt-2 text-gray-600">Son 30 günde en çok beğeni alan kullanıcılar</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800">
            📅 Son 30 Gün
          </div>
        </div>

        {/* List */}
        <TopUsersList users={users} />
      </div>
    </div>
  );
}
