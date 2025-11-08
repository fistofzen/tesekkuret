import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect('/');
  }
}

async function getAdminStats() {
  const [
    totalUsers,
    totalCompanies,
    totalThanks,
    totalComments,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.thanks.count(),
    prisma.comment.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
  ]);

  return {
    totalUsers,
    totalCompanies,
    totalThanks,
    totalComments,
    pendingReports,
  };
}

async function getPendingReports() {
  const reports = await prisma.report.findMany({
    where: { status: 'PENDING' },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      thanks: {
        select: {
          id: true,
          text: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          company: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return reports;
}

export default async function AdminPage() {
  await checkAdminAccess();
  
  const [stats, reports] = await Promise.all([
    getAdminStats(),
    getPendingReports(),
  ]);

  return <AdminDashboard stats={stats} reports={reports} />;
}
