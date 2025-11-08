import { z } from 'zod';
import { validateProfanity } from './profanity-filter';

// Media validation
export function validateMediaType(contentType: string, type: 'image' | 'video'): boolean {
  if (type === 'image') {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(contentType);
  }
  
  if (type === 'video') {
    return ['video/mp4'].includes(contentType);
  }
  
  return false;
}

export function validateMediaSize(size: number, type: 'image' | 'video'): boolean {
  const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 5MB for images, 50MB for videos
  return size <= maxSize;
}

// Enhanced Zod schemas with profanity check
export const thanksTextSchema = z
  .string()
  .min(10, 'En az 10 karakter girmelisiniz')
  .max(1000, 'En fazla 1000 karakter girebilirsiniz')
  .refine(
    (text) => {
      const validation = validateProfanity(text);
      return validation.valid;
    },
    {
      message: 'İçerik uygunsuz kelimeler içeriyor. Lütfen daha uygun bir dil kullanın.',
    }
  );

export const commentTextSchema = z
  .string()
  .min(1, 'Yorum boş olamaz')
  .max(500, 'En fazla 500 karakter girebilirsiniz')
  .refine(
    (text) => {
      const validation = validateProfanity(text);
      return validation.valid;
    },
    {
      message: 'İçerik uygunsuz kelimeler içeriyor. Lütfen daha uygun bir dil kullanın.',
    }
  );

export const reportReasonSchema = z
  .string()
  .min(10, 'Şikayet sebebi en az 10 karakter olmalıdır')
  .max(500, 'Şikayet sebebi en fazla 500 karakter olabilir');
