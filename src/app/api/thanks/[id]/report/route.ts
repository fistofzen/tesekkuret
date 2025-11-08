import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reportReasonSchema } from '@/lib/validation';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// POST /api/thanks/[id]/report - Report inappropriate content (auth required)
const createReportSchema = z.object({
  reason: reportReasonSchema,
});

export async function POST(req: Request, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { id: thanksId } = await params;

    // Check if thanks exists
    const thanks = await prisma.thanks.findUnique({
      where: { id: thanksId },
    });

    if (!thanks) {
      return NextResponse.json(
        { error: 'Teşekkür bulunamadı' },
        { status: 404 }
      );
    }

    // Check if user already reported this thanks
    const existingReport = await prisma.report.findUnique({
      where: {
        userId_thanksId: {
          userId: session.user.id,
          thanksId,
        },
      },
    });

    if (existingReport) {
      return NextResponse.json(
        { error: 'Bu içeriği zaten şikayet ettiniz' },
        { status: 409 }
      );
    }

    const body = await req.json();
    const data = createReportSchema.parse(body);

    // Create report
    const report = await prisma.report.create({
      data: {
        userId: session.user.id,
        thanksId,
        reason: data.reason,
      },
    });

    return NextResponse.json(
      {
        message: 'Şikayetiniz alınmıştır. İnceleme yapılacaktır.',
        reportId: report.id,
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

    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Şikayet oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
}
