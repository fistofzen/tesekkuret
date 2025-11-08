'use client';

export function StatsSection() {
  const stats = [
    {
      icon: '👥',
      value: '2.5M+',
      label: 'Mutlu Kullanıcı',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🏢',
      value: '150K+',
      label: 'Kayıtlı Şirket',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💝',
      value: '5M+',
      label: 'Teşekkür',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: '⭐',
      value: '98%',
      label: 'Memnuniyet Oranı',
      gradient: 'from-yellow-500 to-orange-500',
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Çözüm Başarısı
          </h2>
          <p className="text-lg text-gray-600">
            Pozitif deneyimlerinizle binlerce kişiye ilham veriyoruz
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-8 shadow-lg transition hover:shadow-2xl"
            >
              {/* Gradient Accent */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 transition group-hover:opacity-10`}
              ></div>

              {/* Content */}
              <div className="relative text-center">
                <div className="mb-4 text-5xl">{stat.icon}</div>
                <div
                  className={`mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-4xl font-bold text-transparent`}
                >
                  {stat.value}
                </div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
              </div>

              {/* Decorative Circle */}
              <div
                className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5`}
              ></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
