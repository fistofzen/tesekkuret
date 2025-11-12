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
    pendingCompanies,
    pendingComments,
    pendingThanks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.company.count(),
    prisma.thanks.count(),
    prisma.comment.count(),
    prisma.report.count({ where: { status: 'PENDING' } }),
    prisma.company.count({ where: { isApproved: false } }),
    prisma.comment.count({ where: { isApproved: false } }),
    prisma.thanks.count({ where: { isApproved: false } }),
  ]);

  return {
    totalUsers,
    totalCompanies,
    totalThanks,
    totalComments,
    pendingReports,
    pendingCompanies,
    pendingComments,
    pendingThanks,
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

  // Convert Date to string for serialization
  return reports.map(report => ({
    ...report,
    createdAt: report.createdAt.toISOString(),
  }));
}

async function getPendingCompanies() {
  const companies = await prisma.company.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return companies.map(company => ({
    ...company,
    createdAt: company.createdAt.toISOString(),
  }));
}

async function getPendingComments() {
  const comments = await prisma.comment.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      thanks: {
        select: {
          id: true,
          text: true,
        },
      },
    },
  });

  return comments.map(comment => ({
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  }));
}

async function getPendingThanks() {
  const thanks = await prisma.thanks.findMany({
    where: { isApproved: false },
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      targetUser: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return thanks.map(thank => ({
    ...thank,
    createdAt: thank.createdAt.toISOString(),
  }));
}

export default async function AdminPage() {
  await checkAdminAccess();
  
  const [stats, reports, pendingCompanies, pendingComments, pendingThanks] = await Promise.all([
    getAdminStats(),
    getPendingReports(),
    getPendingCompanies(),
    getPendingComments(),
    getPendingThanks(),
  ]);

  return (
    <AdminDashboard
      stats={stats}
      reports={reports}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pendingCompanies={pendingCompanies as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pendingComments={pendingComments as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      pendingThanks={pendingThanks as any}
    />
  );
}
