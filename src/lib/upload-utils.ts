export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type MediaType = 'image' | 'video';

export const FILE_SIZE_LIMITS = {
  image: 5 * 1024 * 1024, // 5MB
  video: 50 * 1024 * 1024, // 50MB
} as const;

export const ALLOWED_MIME_TYPES = {
  image: ['image/jpeg', 'image/png', 'image/webp'],
  video: ['video/mp4'],
} as const;

/**
 * Validate file before upload
 */
export function validateFile(file: File, type: MediaType): { valid: boolean; error?: string } {
  // Check file size
  const maxSize = FILE_SIZE_LIMITS[type];
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Dosya boyutu çok büyük. Maksimum: ${maxSize / 1024 / 1024}MB`,
    };
  }

  // Check MIME type
  const allowedTypes = ALLOWED_MIME_TYPES[type];
  if (!allowedTypes.includes(file.type as never)) {
    return {
      valid: false,
      error: `Geçersiz dosya formatı. İzin verilen formatlar: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
