import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/companies - Search and list companies
const searchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  size: z.coerce.number().int().positive().max(100).default(20),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const params = searchSchema.parse({
      q: searchParams.get('q') || undefined,
      page: searchParams.get('page') || '1',
      size: searchParams.get('size') || '20',
    });

    const { q, page, size } = params;
    const skip = (page - 1) * size;

    // Build where clause
    const where = q
      ? {
          isApproved: true, // Only show approved companies
          OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { slug: { contains: q, mode: 'insensitive' as const } },
            { category: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : { isApproved: true }; // Only show approved companies

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: size,
        orderBy: [{ name: 'asc' }],
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          category: true,
          createdAt: true,
          _count: {
            select: {
              thanks: true,
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return NextResponse.json({
      companies,
      pagination: {
        page,
        size,
        total,
        totalPages: Math.ceil(total / size),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz parametreler', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Şirketler yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// POST /api/companies - Create new company (auth required)
const createCompanySchema = z.object({
  name: z.string().min(1, 'Şirket adı gereklidir').max(100),
  category: z.string().min(1, 'Kategori gereklidir').max(50),
  logoUrl: z.string().url('Geçerli bir URL giriniz').optional(),
});

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const data = createCompanySchema.parse(body);

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if company with same name already exists
    const existingCompany = await prisma.company.findFirst({
      where: {
        OR: [
          { name: { equals: data.name, mode: 'insensitive' } },
          { slug },
        ],
      },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: 'Bu isimde bir şirket zaten mevcut' },
        { status: 409 }
      );
    }

    // Create company
    const company = await prisma.company.create({
      data: {
        name: data.name,
        slug,
        category: data.category,
        logoUrl: data.logoUrl || null,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Geçersiz veri', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error creating company:', error);
    return NextResponse.json(
      { error: 'Şirket oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
