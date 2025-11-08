'use client';

import Image from '@/components/ui/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { HeartIcon, DocumentTextIcon, ClockIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  totalLikes: number;
  thanksCount: number;
  lastThanksDate: string | null;
}

interface TopUsersListProps {
  users: User[];
}

export function TopUsersList({ users }: TopUsersListProps) {
  return (
    <div className="space-y-3">
      {users.length > 0 ? (
        users.map((user, index) => (
          <Link
            key={user.id}
            href={`/kullanici/${user.id}`}
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

              {/* Avatar */}
              <div className="flex-shrink-0">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || 'User'}
                    width={48}
                    height={48}
                    className="rounded-full ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-base font-semibold text-white ring-2 ring-gray-100">
                    {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600">
                  {user.name || user.email || 'Anonim Kullanıcı'}
                </h3>
                {user.name && user.email && (
                  <p className="truncate text-sm text-gray-600">{user.email}</p>
                )}
              </div>

              {/* Stats */}
              <div className="hidden flex-shrink-0 gap-6 sm:flex">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm font-semibold text-red-600">
                    <HeartIcon className="h-4 w-4" aria-hidden="true" />
                    {user.totalLikes.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-xs text-gray-500">Toplam Beğeni</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
                    <DocumentTextIcon className="h-4 w-4" aria-hidden="true" />
                    {user.thanksCount.toLocaleString('tr-TR')}
                  </div>
                  <div className="text-xs text-gray-500">Teşekkür</div>
                </div>

                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                    <ClockIcon className="h-4 w-4" aria-hidden="true" />
                    {user.lastThanksDate
                      ? formatDistanceToNow(new Date(user.lastThanksDate), {
                          addSuffix: true,
                          locale: tr,
                        })
                      : '-'}
                  </div>
                  <div className="text-xs text-gray-500">Son Paylaşım</div>
                </div>
              </div>

              {/* Mobile Stats */}
              <div className="flex flex-col gap-1 text-right sm:hidden">
                <div className="text-sm font-semibold text-red-600">
                  {user.totalLikes.toLocaleString('tr-TR')} beğeni
                </div>
                <div className="text-xs text-gray-500">
                  {user.thanksCount.toLocaleString('tr-TR')} teşekkür
                </div>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <p className="text-gray-600">Henüz kullanıcı verisi yok.</p>
        </div>
      )}
    </div>
  );
}
