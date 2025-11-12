import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { UserProfile } from '@/components/user/user-profile';

interface Props {
  params: Promise<{ userId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, bio: true },
  });

  if (!user) {
    return {
      title: 'Kullanıcı Bulunamadı',
    };
  }

  return {
    title: `${user.name || 'Kullanıcı'} | TeşekkürEt`,
    description: user.bio || `${user.name} profilini görüntüle`,
  };
}

async function getUserData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      website: true,
      userType: true,
      profession: true,
      workArea: true,
      createdAt: true,
      _count: {
        select: {
          thanksReceived: true,
          thanks: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  // Get recent thanks received
  // @ts-expect-error - Prisma type cache issue
  const thanksReceived = await prisma.thanks.findMany({
    where: { 
      targetUserId: userId,
      // @ts-expect-error - Prisma type cache issue
      isApproved: true,
    },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return {
    ...user,
    thanksReceived,
  };
}

export default async function UserProfilePage({ params }: Props) {
  const { userId } = await params;
  const userData = await getUserData(userId);

  if (!userData) {
    notFound();
  }

  return <UserProfile user={userData} />;
}
