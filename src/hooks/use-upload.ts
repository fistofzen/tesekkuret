'use client';

import { useState, useCallback } from 'react';
import { createPresignedUrl } from '@/app/actions/upload';
import { validateFile, type MediaType, type UploadProgress, type UploadResult } from '@/lib/upload-utils';

interface UseUploadOptions {
  onSuccess?: (url: string, key: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: UploadProgress) => void;
}

export function useUpload(type: MediaType, options?: UseUploadOptions) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress>({
    loaded: 0,
    total: 0,
    percentage: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      setIsUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });

      try {
        // Validate file
        const validation = validateFile(file, type);
        if (!validation.valid) {
          setError(validation.error || 'Geçersiz dosya');
          options?.onError?.(validation.error || 'Geçersiz dosya');
          return { success: false, error: validation.error };
        }

        // Get presigned URL from server
        const result = await createPresignedUrl({
          type,
          contentType: file.type,
          fileSize: file.size,
        });

        if (!result.success || !result.url || !result.publicUrl || !result.key) {
          const errorMsg = result.error || 'URL oluşturulamadı';
          setError(errorMsg);
          options?.onError?.(errorMsg);
          return { success: false, error: errorMsg };
        }

        const { url: presignedUrl, publicUrl, key } = result;

        // Upload to S3 with progress tracking
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentage = Math.round((e.loaded / e.total) * 100);
            const progressData = {
              loaded: e.loaded,
              total: e.total,
              percentage,
            };
            setProgress(progressData);
            options?.onProgress?.(progressData);
          }
        });

        // Upload file
        await new Promise<void>((resolve, reject) => {
          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve();
            } else {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          });

          xhr.addEventListener('error', () => {
            reject(new Error('Upload failed'));
          });

          xhr.open('PUT', presignedUrl);
          xhr.setRequestHeader('Content-Type', file.type);
          xhr.send(file);
        });

        // Success
        setUploadedUrl(publicUrl);
        options?.onSuccess?.(publicUrl, key);

        return {
          success: true,
          url: publicUrl,
          key,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Yükleme başarısız oldu';
        setError(errorMsg);
        options?.onError?.(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setIsUploading(false);
      }
    },
    [type, options]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress({ loaded: 0, total: 0, percentage: 0 });
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    uploadedUrl,
    reset,
  };
}
