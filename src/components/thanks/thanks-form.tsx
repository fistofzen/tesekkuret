'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { MagnifyingGlassIcon, PhotoIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

const thanksSchema = z.object({
  companyId: z.string().min(1, 'Şirket seçmelisiniz'),
  text: z.string().min(10, 'En az 10 karakter girmelisiniz').max(1000, 'En fazla 1000 karakter girebilirsiniz'),
  mediaUrl: z.string().url().optional().or(z.literal('')),
  mediaType: z.enum(['image', 'video']).optional(),
});

type ThanksFormData = z.infer<typeof thanksSchema>;

interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  category: string;
}

export function ThanksForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companySlug = searchParams.get('sirket');

  const [formData, setFormData] = useState<ThanksFormData>({
    companyId: '',
    text: '',
    mediaUrl: '',
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyResults, setCompanyResults] = useState<Company[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load company from URL parameter
  useEffect(() => {
    if (companySlug) {
      fetch(`/api/companies/${companySlug}`)
        .then((res) => res.json())
        .then((company) => {
          setSelectedCompany(company);
          setFormData((prev) => ({ ...prev, companyId: company.id }));
          setCompanyQuery(company.name);
        })
        .catch(console.error);
    }
  }, [companySlug]);

  // Debounced company search
  useEffect(() => {
    if (companyQuery.length < 2) {
      setCompanyResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsLoadingCompanies(true);
      try {
        const res = await fetch(`/api/companies?q=${encodeURIComponent(companyQuery)}&size=10`);
        const data = await res.json();
        setCompanyResults(data.companies || []);
        setShowCompanyDropdown(true);
      } catch (error) {
        console.error('Error fetching companies:', error);
      } finally {
        setIsLoadingCompanies(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [companyQuery]);

  const handleCompanySelect = (company: Company) => {
    setSelectedCompany(company);
    setFormData((prev) => ({ ...prev, companyId: company.id }));
    setCompanyQuery(company.name);
    setShowCompanyDropdown(false);
    setErrors((prev) => ({ ...prev, companyId: '' }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';

      // Get presigned URL
      const { createPresignedUrl } = await import('@/app/actions/upload');
      const result = await createPresignedUrl({
        type: mediaType,
        contentType: file.type,
        fileSize: file.size,
      });

      if (!result.success || !result.url || !result.publicUrl) {
        throw new Error(result.error || 'URL oluşturulamadı');
      }

      const presignedUrl = result.url;
      const publicUrl = result.publicUrl;

      // Upload to S3 with progress
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
        }
      });

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

      setFormData((prev) => ({
        ...prev,
        mediaUrl: publicUrl,
        mediaType,
      }));

      toast.success('Dosya yüklendi!');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dosya yüklenemedi';
      toast.error(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveMedia = () => {
    setFormData((prev) => ({
      ...prev,
      mediaUrl: '',
      mediaType: undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const result = thanksSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0]?.toString();
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/thanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Teşekkür gönderilemedi');
      }

      const newThanks = await res.json();

      toast.success('Teşekkürünüz başarıyla gönderildi!');

      // Redirect to the thanks detail page
      router.push(`/tesekkurler/${newThanks.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = formData.text.length;
  const charLimit = 1000;
  const charRemaining = charLimit - charCount;

  return (
    <>
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        {/* Company Select */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
            Şirket <span className="text-red-600">*</span>
          </label>
          <div className="relative mt-2">
            <div className="relative">
              <MagnifyingGlassIcon
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                id="company"
                value={companyQuery}
                onChange={(e) => {
                  setCompanyQuery(e.target.value);
                  if (selectedCompany) {
                    setSelectedCompany(null);
                    setFormData((prev) => ({ ...prev, companyId: '' }));
                  }
                }}
                onFocus={() => setShowCompanyDropdown(true)}
                placeholder="Şirket ara..."
                className={`block w-full rounded-xl border py-3 pl-11 pr-4 shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                  errors.companyId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            </div>

            {/* Dropdown */}
            {showCompanyDropdown && companyQuery.length >= 2 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
                {isLoadingCompanies ? (
                  <div className="p-4 text-center text-sm text-gray-600">Aranıyor...</div>
                ) : companyResults.length > 0 ? (
                  <ul className="max-h-60 overflow-auto py-2">
                    {companyResults.map((company) => (
                      <li key={company.id}>
                        <button
                          type="button"
                          onClick={() => handleCompanySelect(company)}
                          className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-50"
                        >
                          {company.logoUrl && (
                            <Image
                              src={company.logoUrl}
                              alt={company.name}
                              width={32}
                              height={32}
                              className="rounded object-contain"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{company.name}</div>
                            <div className="text-xs text-gray-600">{company.category}</div>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-sm text-gray-600">Şirket bulunamadı</div>
                )}
              </div>
            )}
          </div>
          {errors.companyId && <p className="mt-1 text-sm text-red-600">{errors.companyId}</p>}
        </div>

        {/* Text Area */}
        <div>
          <label htmlFor="text" className="block text-sm font-semibold text-gray-900">
            Teşekkür Metniniz <span className="text-red-600">*</span>
          </label>
          <div className="mt-2">
            <textarea
              id="text"
              rows={6}
              value={formData.text}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, text: e.target.value }));
                setErrors((prev) => ({ ...prev, text: '' }));
              }}
              placeholder="İyi deneyiminizi paylaşın..."
              className={`block w-full rounded-xl border px-4 py-3 shadow-sm transition-colors focus:outline-none focus:ring-2 ${
                errors.text
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <div>{errors.text && <p className="text-sm text-red-600">{errors.text}</p>}</div>
            <p
              className={`text-sm ${
                charRemaining < 0
                  ? 'font-semibold text-red-600'
                  : charRemaining < 100
                    ? 'text-yellow-600'
                    : 'text-gray-600'
              }`}
            >
              {charCount} / {charLimit}
            </p>
          </div>
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900">Medya (Opsiyonel)</label>
          <div className="mt-2">
            {formData.mediaUrl ? (
              <div className="relative overflow-hidden rounded-xl border border-gray-300">
                {formData.mediaType === 'image' ? (
                  <div className="relative aspect-video w-full">
                    <Image src={formData.mediaUrl} alt="Yüklenen görsel" fill className="object-contain" />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center bg-gray-100">
                    <VideoCameraIcon className="h-16 w-16 text-gray-400" aria-hidden="true" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id="media"
                  accept="image/jpeg,image/png,image/webp,video/mp4"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  className="hidden"
                />
                <label
                  htmlFor="media"
                  className={`flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 transition-colors hover:border-blue-500 hover:bg-blue-50 ${
                    isUploading ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <PhotoIcon className="h-8 w-8 text-gray-400" aria-hidden="true" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">
                      {isUploading ? 'Yükleniyor...' : 'Görsel veya Video Ekle'}
                    </p>
                    <p className="mt-1 text-xs text-gray-600">JPEG, PNG, WEBP (max 5MB) veya MP4 (max 50MB)</p>
                  </div>
                </label>

                {/* Progress Bar */}
                {isUploading && (
                  <div className="mt-3">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-1 text-center text-xs text-gray-600">{uploadProgress}%</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Gönderiliyor...' : '💙 Teşekkürünü Paylaş'}
          </button>
        </div>
      </form>
    </>
  );
}
