# S3 Upload System

S3 uyumlu (AWS S3, Cloudflare R2, MinIO vb.) depolama servisleri için dosya yükleme sistemi.

## Özellikler

- ✅ Presigned URL ile güvenli yükleme
- ✅ Authentication kontrolü (sadece giriş yapmış kullanıcılar)
- ✅ MIME type validasyonu
- ✅ Dosya boyutu kontrolü
- ✅ Progress tracking
- ✅ TypeScript desteği

## Desteklenen Dosya Tipleri

### Resimler
- **Formatlar:** JPEG, PNG, WebP
- **Maksimum Boyut:** 5MB

### Videolar
- **Formatlar:** MP4
- **Maksimum Boyut:** 50MB

## Kurulum

### 1. Environment Variables

`.env` dosyanıza aşağıdaki değişkenleri ekleyin:

```bash
# AWS S3 / Cloudflare R2
S3_ENDPOINT=https://your-endpoint.com
S3_REGION=auto                    # R2 için 'auto', S3 için region
S3_BUCKET=your-bucket-name
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
```

### 2. Cloudflare R2 Yapılandırması

1. Cloudflare Dashboard > R2 > Create Bucket
2. R2 API Token oluşturun
3. Public domain ayarlayın (opsiyonel)

```bash
S3_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
S3_REGION=auto
S3_BUCKET=tesekkurvar-media
```

### 3. AWS S3 Yapılandırması

```bash
S3_ENDPOINT=https://s3.eu-west-1.amazonaws.com
S3_REGION=eu-west-1
S3_BUCKET=tesekkurvar-media
```

## Kullanım

### Server Action (Backend)

```typescript
import { createPresignedUrl } from '@/app/actions/upload';

const result = await createPresignedUrl({
  type: 'image', // veya 'video'
  contentType: 'image/jpeg',
  fileSize: 1024000, // bytes
});

if (result.success) {
  console.log('Presigned URL:', result.url);
  console.log('Public URL:', result.publicUrl);
  console.log('S3 Key:', result.key);
}
```

### React Hook (Frontend)

```typescript
'use client';

import { useUpload } from '@/hooks/use-upload';

function MyComponent() {
  const { upload, isUploading, progress, error, uploadedUrl } = useUpload('image', {
    onSuccess: (url, key) => {
      console.log('Upload successful!', { url, key });
    },
    onProgress: (progress) => {
      console.log(`Progress: ${progress.percentage}%`);
    },
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await upload(file);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileSelect} />
      {isUploading && <p>Yükleniyor: {progress.percentage}%</p>}
      {uploadedUrl && <p>URL: {uploadedUrl}</p>}
      {error && <p>Hata: {error}</p>}
    </div>
  );
}
```

### Ready-to-use Component

```typescript
'use client';

import { FileUpload } from '@/components/file-upload';

function MyPage() {
  return (
    <FileUpload
      type="image"
      maxSizeLabel="Maksimum: 5MB"
      acceptedFormats="JPEG, PNG, WebP"
      onUploadComplete={(url, key) => {
        console.log('Upload complete:', { url, key });
      }}
    />
  );
}
```

## API Reference

### `createPresignedUrl(input)`

Server action - Presigned URL oluşturur.

**Parameters:**
- `type`: `'image' | 'video'`
- `contentType`: MIME type (örn: `'image/jpeg'`)
- `fileSize`: Dosya boyutu (bytes)

**Returns:**
```typescript
{
  success: boolean;
  url?: string;        // Presigned upload URL
  key?: string;        // S3 object key
  publicUrl?: string;  // Public access URL
  error?: string;
}
```

### `useUpload(type, options)`

Client-side hook - Dosya yükleme işlemini yönetir.

**Parameters:**
- `type`: `'image' | 'video'`
- `options`:
  - `onSuccess?: (url: string, key: string) => void`
  - `onError?: (error: string) => void`
  - `onProgress?: (progress: UploadProgress) => void`

**Returns:**
```typescript
{
  upload: (file: File) => Promise<UploadResult>;
  isUploading: boolean;
  progress: UploadProgress;
  error: string | null;
  uploadedUrl: string | null;
  reset: () => void;
}
```

## Güvenlik

- ✅ Sadece authenticate edilmiş kullanıcılar upload yapabilir
- ✅ MIME type kontrolü
- ✅ Dosya boyutu limitleri
- ✅ Presigned URL'ler 5 dakika geçerli
- ✅ Her dosya unique key ile kaydedilir

## Public Access

Yüklenen dosyalara erişim için:

1. **Cloudflare R2:** Public bucket + custom domain
2. **AWS S3:** CloudFront distribution veya public bucket
3. **MinIO:** Public bucket policy

Public URL formatı: `{S3_ENDPOINT}/{S3_BUCKET}/{key}`

## Örnek: Teşekkür Postu ile Kullanım

```typescript
'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';

function CreateThanksPost() {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);

  const handleUploadComplete = (url: string, type: 'image' | 'video') => {
    setMediaUrl(url);
    setMediaType(type);
  };

  const handleSubmit = async () => {
    // API'ye gönder
    const response = await fetch('/api/thanks', {
      method: 'POST',
      body: JSON.stringify({
        text: '...',
        companyId: '...',
        mediaUrl,
        mediaType,
      }),
    });
  };

  return (
    <div>
      <FileUpload
        type="image"
        onUploadComplete={(url) => handleUploadComplete(url, 'image')}
      />
      <button onClick={handleSubmit}>Paylaş</button>
    </div>
  );
}
```
