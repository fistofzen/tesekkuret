'use client';

import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import {
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

interface AdminStats {
  totalUsers: number;
  totalCompanies: number;
  totalThanks: number;
  totalComments: number;
  pendingReports: number;
}

interface Report {
  id: string;
  reason: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  thanks: {
    id: string;
    text: string;
    user: {
      id: string;
      name: string | null;
      email: string | null;
    };
    company: {
      name: string;
    };
  };
}

interface AdminDashboardProps {
  stats: AdminStats;
  reports: Report[];
}

export function AdminDashboard({ stats, reports }: AdminDashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛡️ Admin Panel</h1>
          <p className="mt-2 text-gray-600">Moderasyon ve sistem istatistikleri</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-8 w-8 text-blue-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Kullanıcı</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BuildingOfficeIcon className="h-8 w-8 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCompanies.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Şirket</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <DocumentTextIcon className="h-8 w-8 text-purple-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalThanks.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Teşekkür</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftIcon className="h-8 w-8 text-orange-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalComments.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Yorum</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingReports.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Bekleyen Şikayet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">📋 Bekleyen Şikayetler</h2>

          {reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Şikayet Eden: {report.user.name || report.user.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(report.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                    <Link
                      href={`/tesekkur/${report.thanks.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      İncele →
                    </Link>
                  </div>

                  <div className="mb-3 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">Şikayet Edilen İçerik:</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{report.thanks.text}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Yazan: {report.thanks.user.name || report.thanks.user.email} - Şirket:{' '}
                      {report.thanks.company.name}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-gray-600">Şikayet Sebebi:</p>
                    <p className="text-sm text-gray-800">{report.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">Bekleyen şikayet yok</div>
          )}
        </div>
      </div>
    </div>
  );
}
