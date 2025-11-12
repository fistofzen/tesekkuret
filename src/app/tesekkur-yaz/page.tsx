import { Metadata } from 'next';
import { Suspense } from 'react';
import { ThanksForm } from '@/components/thanks/thanks-form';

export const metadata: Metadata = {
  title: 'Teşekkür Yaz | Teşekkürvar',
  description: 'İyi deneyiminizi paylaşın ve şirketlere teşekkür edin.',
};

export default function ThanksWritePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border-2 border-purple-200">
            <span className="text-3xl">✨</span>
            <span className="text-sm font-bold text-purple-700">Pozitif Enerji Zamanı!</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
              Teşekkür Yaz
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İyi deneyiminizi paylaşın ve şirketlere minnettarlığınızı gösterin 💙
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-8 sm:p-10 shadow-2xl border-2 border-purple-100">
          <Suspense fallback={<div>Yükleniyor...</div>}>
            <ThanksForm />
          </Suspense>
        </div>
        
        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-100">
            <span className="text-2xl">💡</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">İpucu</h3>
              <p className="text-xs text-gray-600">Detaylı ve samimi yazın!</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-100">
            <span className="text-2xl">📸</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Görsel Ekle</h3>
              <p className="text-xs text-gray-600">Fotoğraf paylaşmayı unutma!</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-100">
            <span className="text-2xl">🎯</span>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">Spesifik Ol</h3>
              <p className="text-xs text-gray-600">Neleri beğendiğini belirt!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
