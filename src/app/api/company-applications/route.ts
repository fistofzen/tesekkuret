import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const applicationSchema = z.object({
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  contactName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = applicationSchema.parse(body);

    // Create slug from company name
    const slug = data.companyName
      .toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/ı/g, 'i')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if company already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { name: data.companyName },
          { slug: slug },
        ],
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Bu şirket zaten sistemde kayıtlı' },
        { status: 400 }
      );
    }

    // Create company application (pending approval)
    const company = await prisma.company.create({
      data: {
        name: data.companyName,
        slug: slug,
        category: 'Diğer', // Default category
        isApproved: false, // Pending approval
        applicationData: {
          contactName: data.contactName,
          phone: data.phone,
          email: data.email,
          appliedAt: new Date().toISOString(),
        },
      },
    });

    // TODO: Send notification email to admin
    // TODO: Send confirmation email to applicant

    return NextResponse.json(
      {
        message: 'Başvurunuz alındı. Onaylandıktan sonra şirketiniz platformda görünür olacak.',
        company: {
          id: company.id,
          name: company.name,
          slug: company.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating company application:', error);
    return NextResponse.json(
      { error: 'Başvuru oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
