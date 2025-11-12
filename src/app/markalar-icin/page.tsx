'use client';

import { useState } from 'react';
import { CompanyApplicationModal } from '@/components/company/company-application-modal';

export default function BrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 py-20 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl">
              Şikayetleri memnuniyete dönüştürün,
            </h1>
            <p className="mt-4 text-xl sm:text-2xl">
              marka sadakatini artırın
            </p>
            <p className="mt-6 text-lg sm:text-xl opacity-90">
              potansiyel müşterilerinizi kazanın
            </p>
            <p className="mt-8 text-base opacity-80 max-w-3xl mx-auto">
              Şikayetvar Pro üyelik Avantajlarını Keşfedin.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 rounded-full bg-white px-8 py-4 text-lg font-bold text-purple-600 shadow-2xl transition-all hover:scale-105 hover:shadow-purple-500/50"
            >
              Hemen Üye Ol
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-3xl">🏢</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">247 bin</div>
              <div className="text-sm text-gray-600">Kayıtlı Marka</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-3xl">👥</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">13 milyon</div>
              <div className="text-sm text-gray-600">Bireysel Üye Sayısı</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-3xl">👁️</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">21 milyon</div>
              <div className="text-sm text-gray-600">Son 30 Günde Ziyaretçi</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">70 milyon</div>
              <div className="text-sm text-gray-600">Aylık Sayfa Gösterimi</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Şikayetvar ile neler yapabilirsiniz?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Markanız için en iyi çözümleri sunuyoruz
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Benefit 1 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                <span className="text-3xl">💬</span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Markanıza yöneltilen şikayetlere cevap verebilirsiniz
              </h3>
              <p className="text-gray-600">
                Müşterilerinizin sorunlarına hızlı çözüm sunabilirsiniz.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500">
                <span className="text-3xl">😊</span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Şikayetleri memnuniyete dönüştürme şansı yakalarsınız
              </h3>
              <p className="text-gray-600">
                Hızlı ve etkili çözümlerle müşteri memnuniyetini artırın.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500">
                <span className="text-3xl">⭐</span>
              </div>
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                Şikayetvar memnuniyet puanı ve müşteri teşekkürü alabilirsiniz
              </h3>
              <p className="text-gray-600">
                Marka güvenilirliğinizi artırın ve yeni müşteriler kazanın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">
            Hemen başvurunuzu yapın!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Markanızı Teşekkürvar platformuna ekleyin ve müşteri memnuniyetini artırın.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-white px-10 py-5 text-lg font-bold text-purple-600 shadow-2xl transition-all hover:scale-105 hover:shadow-white/50"
          >
            Ücretsiz Üyelik Başvurusu Oluştur
          </button>
        </div>
      </section>

      {/* Application Modal */}
      <CompanyApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
