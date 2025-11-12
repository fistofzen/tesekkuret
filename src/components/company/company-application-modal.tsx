'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

const applicationSchema = z.object({
  companyName: z.string().min(2, 'Şirket adı en az 2 karakter olmalıdır'),
  contactName: z.string().min(2, 'Ad soyad en az 2 karakter olmalıdır'),
  phone: z.string().min(10, 'Geçerli bir telefon numarası giriniz'),
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
});

interface CompanyApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyApplicationModal({ isOpen, onClose }: CompanyApplicationModalProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate
    const result = applicationSchema.safeParse(formData);
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
      const res = await fetch('/api/company-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Başvuru gönderilemedi');
      }

      toast.success('Başvurunuz başarıyla alındı! 🎉 En kısa sürede size dönüş yapacağız.');
      
      // Reset form
      setFormData({
        companyName: '',
        contactName: '',
        phone: '',
        email: '',
      });
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-2xl transform rounded-3xl bg-white p-8 shadow-2xl transition-all">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-6 top-6 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            {/* Header with Icon */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500">
                <span className="text-3xl">🏢</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Ücretsiz Üyelik Başvurusu Oluştur
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Bilgilerinizi doldurun, size hemen dönelim
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="mb-6 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 p-6">
              <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                Şikayetvar ile neler yapabilirsiniz?
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Markanıza ilgili şikayetlere cevap verebilir, müşterilerinizin sorunlarına çözüm sunabilirsiniz.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Şikayetleri memnuniyete dönüştürme ve daha fazla müşteriye ulaşma şansı yakalarsınız.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Şikayetvar memnuniyet puanı ve müşteri teşekkürleri ile marka güvenilirliğinizi artırırsınız.</span>
                </li>
              </ul>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-bold text-gray-900 mb-2">
                  Şirket <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, companyName: e.target.value }));
                    setErrors((prev) => ({ ...prev, companyName: '' }));
                  }}
                  placeholder="Şirket adınızı giriniz"
                  className={`block w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-4 ${
                    errors.companyName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                />
                {errors.companyName && (
                  <p className="mt-2 text-sm text-red-600">{errors.companyName}</p>
                )}
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-bold text-gray-900 mb-2">
                  Ad soyad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, contactName: e.target.value }));
                    setErrors((prev) => ({ ...prev, contactName: '' }));
                  }}
                  placeholder="Adınız ve soyadınız"
                  className={`block w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-4 ${
                    errors.contactName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                />
                {errors.contactName && (
                  <p className="mt-2 text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-2">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3">
                    <span className="text-2xl">🇹🇷</span>
                    <span className="font-semibold text-gray-700">+90</span>
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, phone: e.target.value }));
                      setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="(___) ___ __ __"
                    className={`block flex-1 rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-4 ${
                      errors.phone
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  E-Posta <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, email: e.target.value }));
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="ornek@sirket.com"
                  className={`block w-full rounded-xl border-2 px-4 py-3 transition-all focus:outline-none focus:ring-4 ${
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                      : 'border-gray-200 focus:border-purple-500 focus:ring-purple-200'
                  }`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Gönderiliyor...
                  </span>
                ) : (
                  'Gönder'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
