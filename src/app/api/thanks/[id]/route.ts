import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE /api/thanks/[id] - Delete a thanks
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if thanks exists and belongs to user
    const thanks = await prisma.thanks.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!thanks) {
      return NextResponse.json(
        { error: 'Teşekkür bulunamadı' },
        { status: 404 }
      );
    }

    if (thanks.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu teşekkürü silme yetkiniz yok' },
        { status: 403 }
      );
    }

    // Delete thanks
    await prisma.thanks.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Teşekkür silindi' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting thanks:', error);
    return NextResponse.json(
      { error: 'Teşekkür silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// PATCH /api/thanks/[id] - Update a thanks
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Giriş yapmanız gerekiyor' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    // Check if thanks exists and belongs to user
    const thanks = await prisma.thanks.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!thanks) {
      return NextResponse.json(
        { error: 'Teşekkür bulunamadı' },
        { status: 404 }
      );
    }

    if (thanks.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Bu teşekkürü düzenleme yetkiniz yok' },
        { status: 403 }
      );
    }

    // Update thanks
    const updatedThanks = await prisma.thanks.update({
      where: { id },
      data: {
        text: body.text,
        ...(body.mediaUrl !== undefined && { mediaUrl: body.mediaUrl || null }),
        ...(body.mediaType !== undefined && { mediaType: body.mediaType || null }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
      },
    });

    return NextResponse.json(updatedThanks, { status: 200 });
  } catch (error) {
    console.error('Error updating thanks:', error);
    return NextResponse.json(
      { error: 'Teşekkür güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
