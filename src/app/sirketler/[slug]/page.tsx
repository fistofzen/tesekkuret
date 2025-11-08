import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CompanyHeader } from '@/components/company/company-header';
import { CompanyFeed } from '@/components/company/company-feed';

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

async function getCompany(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/companies/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch company');
  }

  return res.json();
}

export async function generateMetadata({ params }: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    return {
      title: 'Şirket Bulunamadı',
      description: 'Aradığınız şirket bulunamadı.',
    };
  }

  return {
    title: `${company.name} - Teşekkürler | Teşekkürvar`,
    description: `${company.name} şirketine yapılan teşekkürler. ${company.stats.totalThanks} teşekkür, son 30 günde ${company.stats.recentThanks} teşekkür. ${company.category} kategorisinde.`,
    openGraph: {
      title: `${company.name} - Teşekkürler`,
      description: `${company.name} şirketine yapılan ${company.stats.totalThanks} teşekkürü keşfedin.`,
      images: company.logoUrl ? [{ url: company.logoUrl }] : [],
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompany(slug);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CompanyHeader company={company} />
      <CompanyFeed companySlug={slug} />
    </div>
  );
}
