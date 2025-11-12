'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
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
  pendingCompanies: number;
  pendingComments: number;
  pendingThanks: number;
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
    } | null;
  };
}

interface PendingCompany {
  id: string;
  name: string;
  slug: string;
  category: string;
  logoUrl: string | null;
  applicationData: {
    contactName?: string;
    phone?: string;
    email?: string;
    appliedAt?: string;
  } | null;
  createdAt: string;
}

interface PendingComment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  thanks: {
    id: string;
    text: string;
  };
}

interface PendingThanks {
  id: string;
  text: string;
  mediaUrl: string | null;
  mediaType: string | null;
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
  } | null;
  targetUser: {
    id: string;
    name: string | null;
  } | null;
}

interface AdminDashboardProps {
  stats: AdminStats;
  reports: Report[];
  pendingCompanies: PendingCompany[];
  pendingComments: PendingComment[];
  pendingThanks: PendingThanks[];
}

export function AdminDashboard({ stats, reports, pendingCompanies, pendingComments, pendingThanks }: AdminDashboardProps) {
  const [companies, setCompanies] = useState(pendingCompanies);
  const [comments, setComments] = useState(pendingComments);
  const [thanks, setThanks] = useState(pendingThanks);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCompanyAction = async (companyId: string, action: 'approve' | 'reject') => {
    setLoading(companyId);
    try {
      const response = await fetch(`/api/admin/companies/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) throw new Error('Failed to process company action');

      // Remove company from list
      setCompanies(companies.filter((c) => c.id !== companyId));
    } catch (error) {
      console.error('Error processing company:', error);
      alert('İşlem başarısız oldu');
    } finally {
      setLoading(null);
    }
  };

    const handleCommentAction = async (commentId: string, action: 'approve' | 'reject') => {
    setLoading(commentId);
    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process comment');
      }

      // Optimistically update UI
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Error processing comment:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleThanksAction = async (thanksId: string, action: 'approve' | 'reject') => {
    setLoading(thanksId);
    try {
      const response = await fetch(`/api/admin/thanks/${thanksId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        throw new Error('Failed to process thanks');
      }

      // Optimistically update UI
      setThanks(thanks.filter(t => t.id !== thanksId));
    } catch (error) {
      console.error('Error processing thanks:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛡️ Admin Panel</h1>
          <p className="mt-2 text-gray-600">Moderasyon ve sistem istatistikleri</p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-7">
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

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <BuildingOfficeIcon className="h-8 w-8 text-yellow-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingCompanies.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Bekleyen Şirket</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <ChatBubbleLeftIcon className="h-8 w-8 text-pink-600" aria-hidden="true" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingComments.toLocaleString('tr-TR')}
                </p>
                <p className="text-sm text-gray-600">Bekleyen Yorum</p>
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
                      Yazan: {report.thanks.user.name || report.thanks.user.email}
                      {report.thanks.company && ` - Şirket: ${report.thanks.company.name}`}
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

        {/* Pending Companies */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">🏢 Bekleyen Şirket Başvuruları</h2>

          {companies.length > 0 ? (
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold text-gray-900">{company.name}</p>
                      <p className="text-sm text-gray-600">Kategori: {company.category}</p>
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(company.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </p>
                    </div>
                  </div>

                  {company.applicationData && (
                    <div className="mb-3 rounded-lg bg-gray-50 p-3">
                      <p className="mb-1 text-xs font-medium text-gray-600">Başvuru Bilgileri:</p>
                      <div className="space-y-1 text-sm text-gray-800">
                        {company.applicationData.contactName && (
                          <p>İletişim: {company.applicationData.contactName}</p>
                        )}
                        {company.applicationData.phone && (
                          <p>Telefon: {company.applicationData.phone}</p>
                        )}
                        {company.applicationData.email && (
                          <p>Email: {company.applicationData.email}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCompanyAction(company.id, 'approve')}
                      disabled={loading === company.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading === company.id ? 'İşleniyor...' : 'Onayla'}
                    </button>
                    <button
                      onClick={() => handleCompanyAction(company.id, 'reject')}
                      disabled={loading === company.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading === company.id ? 'İşleniyor...' : 'Reddet'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">Bekleyen şirket başvurusu yok</div>
          )}
        </div>

        {/* Pending Comments */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">💬 Bekleyen Yorumlar</h2>

          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {comment.user.image && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={comment.user.image}
                            alt={comment.user.name || 'User'}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {comment.user.name || comment.user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/tesekkur/${comment.thanks.id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      İncele →
                    </Link>
                  </div>

                  <div className="mb-3 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">Teşekkür:</p>
                    <p className="text-sm text-gray-800 line-clamp-2">{comment.thanks.text}</p>
                  </div>

                  <div className="mb-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">Yorum:</p>
                    <p className="text-sm text-gray-800">{comment.text}</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCommentAction(comment.id, 'approve')}
                      disabled={loading === comment.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading === comment.id ? 'İşleniyor...' : 'Onayla'}
                    </button>
                    <button
                      onClick={() => handleCommentAction(comment.id, 'reject')}
                      disabled={loading === comment.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading === comment.id ? 'İşleniyor...' : 'Reddet'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">Bekleyen yorum yok</div>
          )}
        </div>

        {/* Pending Thanks */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">❤️ Bekleyen Teşekkürler</h2>

          {thanks.length > 0 ? (
            <div className="space-y-4">
              {thanks.map((thank) => (
                <div key={thank.id} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {thank.user.image && (
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                          <Image
                            src={thank.user.image}
                            alt={thank.user.name || 'User'}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {thank.user.name || thank.user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(thank.createdAt), {
                            addSuffix: true,
                            locale: tr,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {thank.company && (
                        <p className="text-sm font-medium text-blue-600">
                          🏢 {thank.company.name}
                        </p>
                      )}
                      {thank.targetUser && (
                        <p className="text-sm font-medium text-purple-600">
                          👤 {thank.targetUser.name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-3 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-medium text-gray-600">Teşekkür Metni:</p>
                    <p className="text-sm text-gray-800">{thank.text}</p>
                  </div>

                  {thank.imageUrl && (
                    <div className="mb-3 relative h-40 w-full rounded-lg overflow-hidden">
                      <Image
                        src={thank.imageUrl}
                        alt="Teşekkür görseli"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleThanksAction(thank.id, 'approve')}
                      disabled={loading === thank.id}
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading === thank.id ? 'İşleniyor...' : 'Onayla'}
                    </button>
                    <button
                      onClick={() => handleThanksAction(thank.id, 'reject')}
                      disabled={loading === thank.id}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading === thank.id ? 'İşleniyor...' : 'Reddet'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-600">Bekleyen teşekkür yok</div>
          )}
        </div>
      </div>
    </div>
  );
}
