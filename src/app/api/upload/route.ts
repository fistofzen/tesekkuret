import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_BUCKET, isValidImageType, isValidVideoType, MAX_IMAGE_SIZE, MAX_VIDEO_SIZE, generateFileKey, getFileExtension } from '@/lib/s3';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Giriş yapmalısınız' },
        { status: 401 }
      );
    }

    // Get form data
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Dosya bulunamadı' },
        { status: 400 }
      );
    }

    const contentType = file.type;
    const fileSize = file.size;

    // Validate file type and size
    let mediaType: 'image' | 'video';
    
    if (isValidImageType(contentType)) {
      mediaType = 'image';
      if (fileSize > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, error: `Görsel boyutu çok büyük. Maksimum: ${MAX_IMAGE_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }
    } else if (isValidVideoType(contentType)) {
      mediaType = 'video';
      if (fileSize > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { success: false, error: `Video boyutu çok büyük. Maksimum: ${MAX_VIDEO_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Geçersiz dosya tipi' },
        { status: 400 }
      );
    }

    // Generate unique file key
    const extension = getFileExtension(contentType);
    const key = generateFileKey(session.user.id, mediaType, extension);

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to R2
    console.log('Uploading to R2:', {
      endpoint: process.env.S3_ENDPOINT,
      bucket: S3_BUCKET,
      key,
      contentType,
      size: fileSize,
    });

    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      ContentLength: fileSize,
      Metadata: {
        userId: session.user.id,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);
    
    console.log('Upload successful to R2');

    // Use local API proxy instead of direct R2 URL to avoid SSL issues
    const publicUrl = `/api/media/${key}`;

    return NextResponse.json({
      success: true,
      publicUrl,
      key,
      mediaType,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Dosya yüklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}
