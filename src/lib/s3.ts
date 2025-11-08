import { S3Client } from '@aws-sdk/client-s3';

if (!process.env.S3_ENDPOINT) {
  throw new Error('S3_ENDPOINT environment variable is not set');
}

if (!process.env.S3_ACCESS_KEY_ID) {
  throw new Error('S3_ACCESS_KEY_ID environment variable is not set');
}

if (!process.env.S3_SECRET_ACCESS_KEY) {
  throw new Error('S3_SECRET_ACCESS_KEY environment variable is not set');
}

if (!process.env.S3_BUCKET) {
  throw new Error('S3_BUCKET environment variable is not set');
}

export const s3Client = new S3Client({
  region: process.env.S3_REGION || 'auto',
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  // For Cloudflare R2 or other S3-compatible services
  forcePathStyle: true, // R2 requires path-style
});

export const S3_BUCKET = process.env.S3_BUCKET;

// Allowed MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const ALLOWED_VIDEO_TYPES = ['video/mp4'] as const;

// Size limits in bytes
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];
export type AllowedVideoType = (typeof ALLOWED_VIDEO_TYPES)[number];
export type AllowedMediaType = AllowedImageType | AllowedVideoType;

/**
 * Validate content type for images
 */
export function isValidImageType(contentType: string): contentType is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.includes(contentType as AllowedImageType);
}

/**
 * Validate content type for videos
 */
export function isValidVideoType(contentType: string): contentType is AllowedVideoType {
  return ALLOWED_VIDEO_TYPES.includes(contentType as AllowedVideoType);
}

/**
 * Get file extension from MIME type
 */
export function getFileExtension(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
  };
  return mimeToExt[contentType] || 'bin';
}

/**
 * Generate a unique file key
 */
export function generateFileKey(userId: string, type: 'image' | 'video', extension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${type}s/${userId}/${timestamp}-${random}.${extension}`;
}
