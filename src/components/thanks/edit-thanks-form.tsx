'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from '@/components/ui/image';
import toast, { Toaster } from 'react-hot-toast';

interface EditThanksFormProps {
  thanks: {
    id: string;
    text: string;
    mediaUrl: string | null;
    mediaType: 'image' | 'video' | null;
    company: {
      id: string;
      name: string;
      slug: string;
    } | null;
  };
}

export function EditThanksForm({ thanks }: EditThanksFormProps) {
  const router = useRouter();
  const [text, setText] = useState(thanks.text);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (text.length < 10) {
      toast.error('En az 10 karakter girmelisiniz');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/thanks/${thanks.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Teşekkür güncellenemedi');
      }

      toast.success('Teşekkür güncellendi! 🎉');
      router.push(`/tesekkur/${thanks.id}`);
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const charCount = text.length;
  const charLimit = 1000;
  const charRemaining = charLimit - charCount;

  return (
    <>
      <Toaster position="top-right" />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Info (read-only) */}
        {thanks.company && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏢</span>
              <div>
                <div className="text-sm text-gray-600">Teşekkür edilen şirket</div>
                <div className="font-bold text-gray-900">{thanks.company.name}</div>
              </div>
            </div>
          </div>
        )}

        {/* Media Preview (if exists) */}
        {thanks.mediaUrl && (
          <div className="rounded-2xl overflow-hidden border-2 border-gray-200">
            {thanks.mediaType === 'image' ? (
              <Image
                src={thanks.mediaUrl}
                alt="Teşekkür görseli"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            ) : (
              <video src={thanks.mediaUrl} controls className="w-full" />
            )}
          </div>
        )}

        {/* Text Area */}
        <div>
          <label htmlFor="text" className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg">
              ✍️
            </span>
            Teşekkür Mesajı
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            placeholder="Teşekkürünüzü buraya yazın..."
            className="block w-full rounded-2xl border-2 border-purple-200 px-4 py-4 text-lg shadow-lg transition-all focus:outline-none focus:ring-4 focus:border-purple-500 focus:ring-purple-200 hover:border-purple-300 resize-none"
            maxLength={charLimit}
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className={`font-medium ${charRemaining < 50 ? 'text-red-600' : 'text-gray-600'}`}>
              {charCount} / {charLimit} karakter
              {charRemaining < 50 && ` (${charRemaining} kaldı)`}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl font-bold hover:bg-gray-300 transition-all"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={isSubmitting || text.length < 10}
            className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                Güncelleniyor...
              </span>
            ) : (
              '✓ Güncelle'
            )}
          </button>
        </div>
      </form>
    </>
  );
}
