'use client';

import NextImage, { ImageProps } from 'next/image';

/**
 * Wrapper around next/image that automatically adds unoptimized
 * for external URLs (R2, Wikimedia, etc.) to avoid CORS/SSL errors
 */
export default function Image(props: ImageProps) {
  const { src, onError, ...rest } = props;
  
  // Check if src needs unoptimized (R2, Wikimedia, or other external URLs)
  const needsUnoptimized = typeof src === 'string' && (
    src.includes('.r2.dev') || 
    src.includes('.r2.cloudflarestorage.com') ||
    src.includes('wikimedia.org') ||
    src.includes('wikipedia.org') ||
    src.startsWith('/api/media/') // Local R2 proxy
  );
  
  // Add unoptimized for external URLs
  return (
    <NextImage
      src={src}
      {...rest}
      unoptimized={needsUnoptimized || rest.unoptimized}
      onError={(e) => {
        console.error('Image load error:', src, e);
        if (onError) onError(e);
      }}
    />
  );
}
