import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

async function getStats() {
  try {
    const [userCount, companyCount, thanksCount, last30DaysCount] = await Promise.all([
      prisma.user.count(),
      prisma.company.count(),
      prisma.thanks.count(),
      prisma.thanks.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    return {
      userCount,
      companyCount,
      thanksCount,
      last30DaysCount,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      userCount: 0,
      companyCount: 0,
      thanksCount: 0,
      last30DaysCount: 0,
    };
  }
}

export default async function HakkimizdaPage() {
  const stats = await getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Dünyanın İlk ve En Büyük Teşekkür Platformu
            </h1>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Teşekkürlerin çözüme kavuşturulması, müşteri memnuniyetinin artırılması için fırsat sunuyoruz.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong className="text-purple-600">TeşekkürEt</strong>, müşterilerle markalar arasında köprü görevi üstlenen bir pozitif iletişim platformudur.
              Müşteri deneyimlerini ve marka başarılarını sunarak milyonlarca ziyaretçinin alışverişlerinde karar vermelerini kolaylaştırır.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Müşteriler</h3>
                <p className="text-gray-600">
                  Seslerini markaya duyurup teşekkürlerini iletebilir, olumlu deneyimlerini paylaşabilir.
                </p>
              </div>
              <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Markalar</h3>
                <p className="text-gray-600">
                  Teşekkürleri motivasyona dönüştürüp müşteri kitlesini artırabilir, güven inşa edebilir.
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ziyaretçiler</h3>
                <p className="text-gray-600">
                  Alışveriş yapmayı düşündüğü markalarla ilgili gerçek müşteri deneyimlerini öğrenir.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.userCount.toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-gray-600">Bireysel Üye Sayısı</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.companyCount.toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-gray-600">Kayıtlı Marka</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.thanksCount.toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-gray-600">Paylaşılan Teşekkür</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {stats.last30DaysCount.toLocaleString('tr-TR')}
            </div>
            <div className="text-sm text-gray-600">Son 30 Günde Teşekkür</div>
          </div>
        </div>

        {/* Why Thank Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 md:p-12 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">Teşekkür Etmenin Önemi</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">💖 Pozitif Enerji Yayar</h3>
              <p className="text-purple-100 mb-6">
                Teşekkür etmek, hem alan hem de veren için mutluluk kaynağıdır. İyi hizmeti takdir etmek, 
                markaların motivasyonunu artırır ve daha iyi hizmet sunmalarını teşvik eder.
              </p>
              <h3 className="text-xl font-semibold mb-4">🤝 Güven İnşa Eder</h3>
              <p className="text-purple-100">
                Gerçek müşteri teşekkürleri, potansiyel alıcılar için en güvenilir referans kaynağıdır. 
                Olumlu deneyimler paylaşmak, topluluk içinde güven oluşturur.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">🎯 Kaliteyi Artırır</h3>
              <p className="text-purple-100 mb-6">
                Teşekkürler, markaların ne yaptıklarının doğru olduğunu gösterir. Bu geri bildirimler, 
                başarılı uygulamaların devam etmesini ve yaygınlaşmasını sağlar.
              </p>
              <h3 className="text-xl font-semibold mb-4">🌟 Topluluk Oluşturur</h3>
              <p className="text-purple-100">
                Teşekkür platformu, olumlu deneyimleri paylaşan bir topluluk yaratır. Bu topluluk, 
                herkesin daha iyi alışveriş deneyimi yaşamasına katkı sağlar.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* For Customers */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-purple-600 mb-6">Tüketiciyi TeşekkürEt&apos;e Çeken Nedenler</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">✨ Harekete Geçirici Nitelik</h3>
                <p className="text-gray-600">
                  Gerçek müşteriler tarafından yazılan teşekkürler, memnuniyet puanları ve olumlu geri bildirimler, 
                  markaları müşteri deneyimini iyileştirmeye teşvik etmektedir.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🌐 Tüketici Referans Sitesi</h3>
                <p className="text-gray-600">
                  Gerçek tüketici tecrübelerinin yer aldığı TeşekkürEt, tüketiciler için satın alma kararını 
                  ve marka tercihlerini etkileyen en önemli referans kaynağıdır.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">💝 Takdir Etme Kolaylığı</h3>
                <p className="text-gray-600">
                  TeşekkürEt; olumlu deneyimlerin en kısa ve en kolay yoldan, ücretsiz olarak 
                  markalara iletildiği online teşekkür platformudur.
                </p>
              </div>
            </div>
          </div>

          {/* For Brands */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-pink-600 mb-6">TeşekkürEt Markalara Ne Sağlar?</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Marka/Sektör Analizleri</h3>
                <p className="text-gray-600">
                  Markaların müşteri memnuniyetindeki başarılarını görebilmelerini ve bu veriler ışığında 
                  doğru stratejiler belirleyebilmelerini sağlar.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">💬 Geri Bildirim Mekanizması</h3>
                <p className="text-gray-600">
                  Ürün veya hizmetlerle ilgili olumlu geri bildirimler, markaların en büyük motivasyon 
                  kaynaklarıdır ve başarılı uygulamaların sürdürülmesini sağlar.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎁 Memnun Müşterileri Ödüllendirme</h3>
                <p className="text-gray-600">
                  TeşekkürEt, markalar için memnun müşterilerini takdir edebilmesi ve sadık müşteriler 
                  yaratması için bir fırsat doğurur.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🚀 Potansiyel Müşteriler</h3>
                <p className="text-gray-600">
                  TeşekkürEt&apos;teki olumlu değerlendirmeler, markalar hakkında araştırmalar yapan potansiyel 
                  müşterilerde güven duygusu oluşturur.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl shadow-xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Siz de Teşekkür Edin!</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            İyi bir hizmet aldınız mı? Memnun kaldığınız bir deneyim mi yaşadınız? 
            Hemen teşekkür ederek olumlu deneyiminizi paylaşın!
          </p>
          <Link
            href="/tesekkur-yaz"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-600 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
          >
            Teşekkür Yaz
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
