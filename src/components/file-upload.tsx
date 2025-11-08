'use client';

import { useRef, useState } from 'react';
import { useUpload } from '@/hooks/use-upload';
import { formatBytes, type MediaType } from '@/lib/upload-utils';

interface FileUploadProps {
  type: MediaType;
  onUploadComplete?: (url: string, key: string) => void;
  maxSizeLabel?: string;
  acceptedFormats?: string;
}

export function FileUpload({ 
  type, 
  onUploadComplete,
  maxSizeLabel,
  acceptedFormats,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { upload, isUploading, progress, error, uploadedUrl } = useUpload(type, {
    onSuccess: (url, key) => {
      console.log('Upload successful:', { url, key });
      onUploadComplete?.(url, key);
    },
    onError: (error) => {
      console.error('Upload error:', error);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    await upload(selectedFile);
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const accept = type === 'image' 
    ? 'image/jpeg,image/png,image/webp' 
    : 'video/mp4';

  return (
    <div className="w-full space-y-4">
      {/* File Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {type === 'image' ? 'Resim' : 'Video'} Yükle
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
        />
        {maxSizeLabel && (
          <p className="mt-1 text-xs text-gray-500">{maxSizeLabel}</p>
        )}
        {acceptedFormats && (
          <p className="mt-1 text-xs text-gray-500">{acceptedFormats}</p>
        )}
      </div>

      {/* Selected File Info */}
      {selectedFile && !uploadedUrl && (
        <div className="rounded-md bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{formatBytes(selectedFile.size)}</p>
            </div>
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isUploading ? 'Yükleniyor...' : 'Yükle'}
            </button>
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Yükleniyor</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadedUrl && (
        <div className="rounded-md bg-green-50 p-4 space-y-2">
          <p className="text-sm font-medium text-green-800">Yükleme başarılı! ✅</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={uploadedUrl}
              readOnly
              className="flex-1 rounded-md border border-green-300 bg-white px-3 py-2 text-xs text-gray-700"
            />
            <button
              onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
            >
              Kopyala
            </button>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-green-700 hover:text-green-900 underline"
          >
            Yeni dosya yükle
          </button>
        </div>
      )}
    </div>
  );
}
