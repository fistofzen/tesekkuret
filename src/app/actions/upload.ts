'use server';

import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  s3Client,
  S3_BUCKET,
  isValidImageType,
  isValidVideoType,
  getFileExtension,
  generateFileKey,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
} from '@/lib/s3';

interface CreatePresignedUrlInput {
  type: 'image' | 'video';
  contentType: string;
  fileSize: number;
}

interface CreatePresignedUrlResult {
  success: boolean;
  url?: string;
  key?: string;
  publicUrl?: string;
  error?: string;
}

/**
 * Create a presigned URL for uploading files to S3
 * Requires authentication and validates file type and size
 */
export async function createPresignedUrl(
  input: CreatePresignedUrlInput
): Promise<CreatePresignedUrlResult> {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Yükleme yapmak için giriş yapmalısınız',
      };
    }

    const { type, contentType, fileSize } = input;

    // Validate content type
    if (type === 'image') {
      if (!isValidImageType(contentType)) {
        return {
          success: false,
          error: `Geçersiz resim formatı. İzin verilen formatlar: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
        };
      }

      // Validate file size for images
      if (fileSize > MAX_IMAGE_SIZE) {
        return {
          success: false,
          error: `Resim boyutu çok büyük. Maksimum: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
        };
      }
    } else if (type === 'video') {
      if (!isValidVideoType(contentType)) {
        return {
          success: false,
          error: `Geçersiz video formatı. İzin verilen formatlar: ${ALLOWED_VIDEO_TYPES.join(', ')}`,
        };
      }

      // Validate file size for videos
      if (fileSize > MAX_VIDEO_SIZE) {
        return {
          success: false,
          error: `Video boyutu çok büyük. Maksimum: ${MAX_VIDEO_SIZE / 1024 / 1024}MB`,
        };
      }
    } else {
      return {
        success: false,
        error: 'Geçersiz dosya tipi',
      };
    }

    // Generate unique file key
    const extension = getFileExtension(contentType);
    const key = generateFileKey(session.user.id, type, extension);

    // Create presigned URL
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: fileSize,
      // ACL: 'public-read', // Uncomment if your S3 supports ACLs
      Metadata: {
        userId: session.user.id,
        uploadedAt: new Date().toISOString(),
      },
    });

    // Generate presigned URL (valid for 5 minutes)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 300, // 5 minutes
    });

    // Construct public URL (assuming CDN or public bucket)
    // Adjust this based on your S3/CDN configuration
    const publicUrl = `${process.env.S3_ENDPOINT}/${S3_BUCKET}/${key}`;

    return {
      success: true,
      url: presignedUrl,
      key,
      publicUrl,
    };
  } catch (error) {
    console.error('Error creating presigned URL:', error);
    return {
      success: false,
      error: 'Yükleme URL\'si oluşturulurken bir hata oluştu',
    };
  }
}

/**
 * Upload file to S3 using presigned URL (client-side helper)
 */
export async function uploadToS3(presignedUrl: string, file: File): Promise<boolean> {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return false;
  }
}
