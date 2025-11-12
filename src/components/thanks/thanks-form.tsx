'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from '@/components/ui/image';
import { z } from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const thanksSchema = z.object({
  companyId: z.string().min(1, 'Şirket seçmelisiniz'),
  text: z.string().min(10, 'En az 10 karakter girmelisiniz').max(1000, 'En fazla 1000 karakter girebilirsiniz'),
  mediaUrl: z.union([z.string().url(), z.literal('')]).optional(),
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

interface User {
  id: string;
  name: string | null;
  image: string | null;
}

export function ThanksForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const companySlug = searchParams.get('sirket');
  const targetUserId = searchParams.get('kullanici');
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState<ThanksFormData>({
    companyId: '',
    text: '',
    mediaUrl: '',
  });

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [companyQuery, setCompanyQuery] = useState('');
  const [companyResults, setCompanyResults] = useState<Company[]>([]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load user from URL parameter
  useEffect(() => {
    if (targetUserId) {
      fetch(`/api/user/profile?userId=${targetUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setSelectedUser(data.user);
          }
        })
        .catch(console.error);
    }
  }, [targetUserId]);

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
      // Create form data for upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Upload via API route with progress tracking
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentage);
        }
      });

      const uploadPromise = new Promise<{ success: boolean; publicUrl?: string; mediaType?: 'image' | 'video'; error?: string }>((resolve, reject) => {
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch {
              reject(new Error('Invalid response'));
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.error || 'Upload failed'));
            } catch {
              reject(new Error(`Upload failed with status ${xhr.status}`));
            }
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('Network error'));
        });

        xhr.open('POST', '/api/upload');
        xhr.send(uploadFormData);
      });

      const result = await uploadPromise;

      if (!result.success || !result.publicUrl) {
        throw new Error(result.error || 'Upload failed');
      }

      console.log('📥 Upload result:', result);
      
      setFormData((prev) => {
        const updated = {
          ...prev,
          mediaUrl: result.publicUrl || '',
          mediaType: result.mediaType,
        };
        console.log('🔄 Updating formData:', updated);
        return updated;
      });

      toast.success('Dosya yüklendi! ✓');
      console.log('✅ File uploaded successfully:', result.publicUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dosya yüklenemedi';
      console.error('❌ Upload error:', error);
      toast.error(message);
    } finally {
      console.log('🔄 Resetting upload state');
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
    console.log('🔵 handleSubmit called!');
    console.log('🔍 States:', { isSubmitting, isUploading, session: !!session });
    setErrors({});

    // Check if user is logged in
    if (!session) {
      console.log('❌ No session - redirecting to login');
      toast.error('Teşekkür yazabilmek için giriş yapmanız gerekiyor');
      router.push('/giris?callbackUrl=/tesekkur-yaz');
      return;
    }

    // Manual validation for user or company
    if (!selectedUser && !formData.companyId) {
      setErrors({ companyId: 'Bir şirket veya kullanıcı seçmelisiniz' });
      return;
    }

    if (!formData.text || formData.text.length < 10) {
      setErrors({ text: 'En az 10 karakter girmelisiniz' });
      return;
    }

    console.log('✅ Validation passed - submitting...');
    setIsSubmitting(true);

    try {
      // Prepare request body with optional targetUserId
      const requestBody = {
        text: formData.text,
        ...(formData.mediaUrl && { mediaUrl: formData.mediaUrl }),
        ...(formData.mediaType && { mediaType: formData.mediaType }),
        ...(selectedUser ? { targetUserId: selectedUser.id } : { companyId: formData.companyId }),
      };

      const res = await fetch('/api/thanks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Teşekkür gönderilemedi');
      }

      const newThanks = await res.json();

      toast.success('Teşekkürünüz başarıyla oluşturuldu! 🎉');
      
      // Redirect to user profile if thanking a user, otherwise to thanks page
      if (selectedUser) {
        router.push(`/kullanici/${selectedUser.id}`);
      } else {
        router.push(`/tesekkur/${newThanks.id}`);
      }
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
  const charPercentage = (charCount / charLimit) * 100;

  // Quick emoji suggestions
  const quickEmojis = ['😊', '👍', '❤️', '🎉', '✨', '🙏', '💯', '🔥'];
  
  const insertEmoji = (emoji: string) => {
    setFormData((prev) => ({ ...prev, text: prev.text + emoji }));
  };

  return (
    <>
      <Toaster position="top-right" />
      
      {/* Login Warning */}
      {status === 'unauthenticated' && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-yellow-50 border-2 border-yellow-300 p-4">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h3 className="font-bold text-yellow-900 mb-1">Giriş Yapmanız Gerekiyor</h3>
            <p className="text-sm text-yellow-800 mb-3">
              Teşekkür yazabilmek için giriş yapmanız gerekmektedir.
            </p>
            <button
              onClick={() => router.push('/giris?callbackUrl=/tesekkur-yaz')}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      )}
      
      {/* Loading State */}
      {status === 'loading' && (
        <div className="text-center py-8">
          <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8 relative isolate">
        {/* Company/User Select */}
        <div className="group relative z-0">
          {selectedUser ? (
            // Show selected user (read-only)
            <>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                  👤
                </span>
                Kime teşekkür ediyorsun?
              </label>
              <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
                <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-purple-300">
                  {selectedUser.image ? (
                    <Image
                      src={selectedUser.image}
                      alt={selectedUser.name || 'Kullanıcı'}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      👤
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 text-lg">
                    {selectedUser.name || 'İsimsiz Kullanıcı'}
                  </div>
                  <div className="text-sm text-purple-600">
                    Bu kişiye teşekkür edeceksiniz
                  </div>
                </div>
                <div className="px-4 py-2 bg-green-500 text-white rounded-full font-bold text-sm">
                  ✓ Seçildi
                </div>
              </div>
            </>
          ) : (
            // Show company selector
            <>
              <label htmlFor="company" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
                  🏢
                </span>
                Hangi şirkete teşekkür ediyorsun?
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-400"
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
                    placeholder="Şirket adını aramaya başla..."
                    className={`block w-full rounded-2xl border-2 py-4 pl-11 pr-4 text-lg shadow-lg transition-all focus:outline-none focus:ring-4 ${
                      errors.companyId
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-purple-200 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-300'
                    }`}
                  />
                  {selectedCompany && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-300">
                      <span className="text-green-700 font-semibold text-sm">✓ Seçildi</span>
                    </div>
                  )}
                </div>

                {/* Dropdown */}
                {showCompanyDropdown && companyQuery.length >= 2 && (
                  <div className="absolute z-10 mt-3 w-full rounded-2xl border-2 border-purple-200 bg-white shadow-2xl overflow-hidden">
                    {isLoadingCompanies ? (
                      <div className="p-6 text-center">
                        <div className="inline-block w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-2 text-sm text-gray-600">Aranıyor...</p>
                      </div>
                    ) : companyResults.length > 0 ? (
                      <ul className="max-h-64 overflow-auto divide-y divide-gray-100">
                        {companyResults.map((company) => (
                          <li key={company.id}>
                            <button
                              type="button"
                              onClick={() => handleCompanySelect(company)}
                              className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all group"
                            >
                              <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 group-hover:border-purple-300 transition-colors">
                                {company.logoUrl ? (
                                  <Image
                                    src={company.logoUrl}
                                    alt={company.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-2xl">
                                    🏢
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">
                                  {company.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {company.category}
                                </div>
                              </div>
                              <span className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="p-6 text-center">
                        <div className="text-4xl mb-2">🔍</div>
                        <p className="text-sm text-gray-600">Şirket bulunamadı</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.companyId && (
                <div className="mt-2 flex items-center gap-2 text-red-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-medium">{errors.companyId}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Text Area */}
        <div className="group">
          <label htmlFor="text" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white text-lg">
              ✍️
            </span>
            Teşekkür mesajın nedir?
            <span className="text-red-500">*</span>
          </label>
          
          {/* Quick Emoji Bar */}
          <div className="flex items-center gap-2 mb-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <span className="text-xs font-semibold text-gray-600">Hızlı Emojiler:</span>
            <div className="flex gap-1">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-all hover:scale-110"
                  title={`${emoji} ekle`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <textarea
              id="text"
              rows={8}
              value={formData.text}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, text: e.target.value }));
                setErrors((prev) => ({ ...prev, text: '' }));
              }}
              placeholder="Örnek: Bu şirketle yaşadığım müthiş deneyimi paylaşmak istiyorum! Müşteri hizmetleri çok ilgili ve ürün kalitesi harikaydı. Kesinlikle tavsiye ederim! 😊"
              className={`block w-full rounded-2xl border-2 px-5 py-4 text-lg shadow-lg transition-all focus:outline-none focus:ring-4 resize-none ${
                errors.text
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200 hover:border-pink-300'
              }`}
            />
            
            {/* Character Counter with Progress Circle */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - charPercentage / 100)}
                    className={`transition-all duration-300 ${
                      charRemaining < 0
                        ? 'text-red-500'
                        : charRemaining < 100
                          ? 'text-yellow-500'
                          : 'text-green-500'
                    }`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-xs font-bold ${
                      charRemaining < 0
                        ? 'text-red-600'
                        : charRemaining < 100
                          ? 'text-yellow-600'
                          : 'text-green-600'
                    }`}
                  >
                    {charRemaining < 0 ? charRemaining : charCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div>
              {errors.text && (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-lg">⚠️</span>
                  <p className="text-sm font-medium">{errors.text}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">
              {charCount < 10 && 'En az 10 karakter gerekli'}
              {charCount >= 10 && charRemaining >= 0 && `${charRemaining} karakter kaldı`}
              {charRemaining < 0 && `${Math.abs(charRemaining)} karakter fazla!`}
            </p>
          </div>
        </div>

        {/* Media Upload */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-lg">
              📸
            </span>
            Görsel veya Video Ekle (Opsiyonel)
          </label>
          
          <div className="space-y-4">
            {formData.mediaUrl ? (
              <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 shadow-xl pointer-events-auto">
                <div className="relative aspect-video w-full bg-gradient-to-br from-blue-50 to-cyan-50">
                  {/* Use unoptimized to avoid Next.js trying to fetch from R2 endpoint */}
                  <Image 
                    src={formData.mediaUrl} 
                    alt="Yüklenen medya" 
                    fill 
                    className="object-contain p-4 pointer-events-none"
                    unoptimized
                  />
                </div>
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute right-3 top-3 rounded-full bg-red-500 p-2.5 text-white shadow-2xl hover:bg-red-600 transition-all hover:scale-110 z-10 pointer-events-auto"
                >
                  <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                </button>
                <div className="absolute bottom-3 left-3 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-700 shadow-lg pointer-events-none">
                  ✓ Yüklendi
                </div>
              </div>
            ) : (
              <>
                {/* File Upload Area */}
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
                    className={`group relative flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-3 border-dashed bg-gradient-to-br from-blue-50 to-cyan-50 px-6 py-12 transition-all hover:from-blue-100 hover:to-cyan-100 ${
                      isUploading 
                        ? 'cursor-not-allowed opacity-50 border-gray-300' 
                        : 'border-blue-300 hover:border-blue-500 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-5xl">📁</div>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {isUploading ? '⏳ Yükleniyor...' : '🖼️ Dosya Seç veya Sürükle Bırak'}
                      </p>
                      <p className="mt-2 text-sm text-gray-600">
                        JPEG, PNG, WEBP (max 5MB) • MP4 (max 50MB)
                      </p>
                    </div>
                  </label>

                  {/* Progress Bar */}
                  {isUploading && (
                    <div className="mt-4 space-y-2">
                      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 shadow-inner">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300 shadow-lg relative"
                          style={{ width: `${uploadProgress}%` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold text-blue-600">Yükleniyor...</span>
                        <span className="font-bold text-gray-900">{uploadProgress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-4 pt-6 border-t-2 border-gray-100 relative z-50">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-2xl border-2 border-gray-300 px-8 py-4 text-base font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all hover:shadow-lg relative z-50 cursor-pointer"
          >
            ← Geri Dön
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            onClick={() => {
              console.log('🖱️ BUTTON CLICKED!');
              console.log('Button disabled?', isSubmitting || isUploading);
              console.log('isSubmitting:', isSubmitting);
              console.log('isUploading:', isUploading);
            }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 px-10 py-4 text-base font-bold text-white shadow-2xl transition-all hover:shadow-pink-500/50 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 group z-50 cursor-pointer"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Gönderiliyor...</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">💙</span>
                  <span>Teşekkürünü Paylaş</span>
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>
        </div>
      </form>
    </>
  );
}
