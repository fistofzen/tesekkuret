import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { EditThanksForm } from '@/components/thanks/edit-thanks-form';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Teşekkürü Düzenle | Teşekkürvar',
};

async function getThanks(id: string) {
  const thanks = await prisma.thanks.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
        },
      },
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return thanks;
}

export default async function EditThanksPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect('/giris?callbackUrl=' + encodeURIComponent(`/tesekkur/${(await params).id}/duzenle`));
  }

  const { id } = await params;
  const thanks = await getThanks(id);

  if (!thanks) {
    notFound();
  }

  // Check if user owns this thanks
  if (thanks.user.id !== session.user.id) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Teşekkürü Düzenle
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Teşekkürünüzü güncelleyin
          </p>
        </div>

        <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-8 sm:p-10 shadow-2xl border-2 border-purple-100">
          <EditThanksForm thanks={thanks} />
        </div>
      </div>
    </div>
  );
}
