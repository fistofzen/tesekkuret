import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmet.yilmaz@example.com',
        name: 'Ahmet Yılmaz',
        image: 'https://i.pravatar.cc/150?img=12',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ayse.demir@example.com',
        name: 'Ayşe Demir',
        image: 'https://i.pravatar.cc/150?img=23',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mehmet.kara@example.com',
        name: 'Mehmet Kara',
        image: 'https://i.pravatar.cc/150?img=33',
      },
    }),
    prisma.user.create({
      data: {
        email: 'fatma.celik@example.com',
        name: 'Fatma Çelik',
        image: 'https://i.pravatar.cc/150?img=44',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ali.ozturk@example.com',
        name: 'Ali Öztürk',
        image: 'https://i.pravatar.cc/150?img=55',
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Migros',
        slug: 'migros',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Migros_Logo.svg/200px-Migros_Logo.svg.png',
        category: 'Market',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Türk Telekom',
        slug: 'turk-telekom',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Turk_Telekom_logo.svg/200px-Turk_Telekom_logo.svg.png',
        category: 'Telekomünikasyon',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Starbucks',
        slug: 'starbucks',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/200px-Starbucks_Corporation_Logo_2011.svg.png',
        category: 'Kafe',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Hepsiburada',
        slug: 'hepsiburada',
        logoUrl: 'https://cdn.dsmcdn.com/web/logo/hepsiburada.svg',
        category: 'E-ticaret',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Zara',
        slug: 'zara',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/200px-Zara_Logo.svg.png',
        category: 'Giyim',
      },
    }),
    prisma.company.create({
      data: {
        name: 'THY',
        slug: 'thy',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/200px-Turkish_Airlines_logo_2019_compact.svg.png',
        category: 'Havayolu',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Yemeksepeti',
        slug: 'yemeksepeti',
        logoUrl: 'https://cdn.yemeksepeti.com/assets/img/logo.svg',
        category: 'Yemek',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Teknosa',
        slug: 'teknosa',
        logoUrl: 'https://www.teknosa.com/static/img/teknosa-logo.svg',
        category: 'Elektronik',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Arçelik',
        slug: 'arcelik',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Arcelik_logo.svg/200px-Arcelik_logo.svg.png',
        category: 'Beyaz Eşya',
      },
    }),
    prisma.company.create({
      data: {
        name: 'Decathlon',
        slug: 'decathlon',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Decathlon_Logo.svg/200px-Decathlon_Logo.svg.png',
        category: 'Spor',
      },
    }),
  ]);

  console.log(`✅ Created ${companies.length} companies`);

  // Create sample thanks posts
  const thanksData = [
    {
      text: 'Migros Bakırköy şubesinde çalışan Elif hanım inanılmaz yardımcı oldu. Ağır alışverişimi arabaya taşımama yardım etti. Teşekkür ederim!',
      companyId: companies[0].id,
      userId: users[0].id,
    },
    {
      text: 'Türk Telekom müşteri hizmetleri gerçekten harika. Sorunumu 10 dakikada çözdüler. İyi ki varsınız!',
      companyId: companies[1].id,
      userId: users[1].id,
    },
    {
      text: 'Starbucks Nişantaşı şubesindeki barista Ahmet bey kahve konusunda çok bilgili. Her zaman güleryüzle karşılıyor. Teşekkürler!',
      companyId: companies[2].id,
      userId: users[2].id,
    },
    {
      text: 'Hepsiburada kargo hızı inanılmaz! Dün akşam sipariş verdim bugün sabah elimdeydi. Süper hizmet!',
      companyId: companies[3].id,
      userId: users[3].id,
    },
    {
      text: 'Zara Kadıköy mağazasında Ayşe hanım çok yardımcı oldu. Kombinleri seçmeme yardım etti, harika bir alışveriş deneyimi oldu.',
      companyId: companies[4].id,
      userId: users[4].id,
    },
    {
      text: 'THY uçuş görevlileri gerçekten profesyonel. Uçakta rahatsızlandım, hemen ilgilendiler. Çok teşekkür ederim!',
      companyId: companies[5].id,
      userId: users[0].id,
    },
    {
      text: 'Yemeksepeti kurye Mehmet bey yağmur altında siparişimi getirdi. Güleryüzlü ve hızlıydı. Süper hizmet!',
      companyId: companies[6].id,
      userId: users[1].id,
    },
    {
      text: 'Teknosa Kartal AVM şubesinde laptop almıştım. Satış danışmanı tüm modelleri detaylıca anlattı, bütçeme en uygun olanı buldum.',
      companyId: companies[7].id,
      userId: users[2].id,
    },
    {
      text: 'Arçelik servisi çok hızlı geldi. Bulaşık makinemi aynı gün tamir ettiler. Mükemmel servis!',
      companyId: companies[8].id,
      userId: users[3].id,
    },
    {
      text: 'Decathlon Ataşehir mağazasında koşu ayakkabısı aldım. Personel ayağıma en uygun modeli bulmama yardım etti. Harika!',
      companyId: companies[9].id,
      userId: users[4].id,
    },
    {
      text: 'Migros Online hizmeti süper! Siparişim zamanında geldi, taze ürünler. Çok memnunum, teşekkürler!',
      companyId: companies[0].id,
      userId: users[1].id,
    },
    {
      text: 'Türk Telekom fiber internet bağlantısı çok stabil. 3 aydır hiç sorun yaşamadım. Kesinlikle tavsiye ederim!',
      companyId: companies[1].id,
      userId: users[2].id,
    },
    {
      text: 'Starbucks uygulamasında çok güzel kampanyalar var. Her hafta farklı bir şey deniyorum. Teşekkürler!',
      companyId: companies[2].id,
      userId: users[3].id,
    },
    {
      text: 'Hepsiburada müşteri hizmetleri iade işlemimi çok hızlı halletti. Paramı 2 gün içinde geri aldım. Mükemmel!',
      companyId: companies[3].id,
      userId: users[4].id,
    },
    {
      text: 'Zara yeni koleksiyonu çok şık. Özellikle blazer modelleri harika. Kesinlikle tekrar geleceğim!',
      companyId: companies[4].id,
      userId: users[0].id,
    },
    {
      text: 'THY Business Class hizmeti dünya standartlarında. Uzun uçuşta çok rahat ettim. Teşekkürler!',
      companyId: companies[5].id,
      userId: users[1].id,
    },
    {
      text: 'Yemeksepeti restoranlar çeşitliliği harika. Her gün farklı bir mutfak deniyorum. Süper uygulama!',
      companyId: companies[6].id,
      userId: users[2].id,
    },
    {
      text: 'Teknosa telefon kılıfı aldım, çok kaliteli çıktı. Fiyatı da uygundu. Kesinlikle tavsiye ederim!',
      companyId: companies[7].id,
      userId: users[3].id,
    },
    {
      text: 'Arçelik çamaşır makinesi 5 yıldır sorunsuz çalışıyor. Türk malı kalitesi! Tebrikler!',
      companyId: companies[8].id,
      userId: users[4].id,
    },
    {
      text: 'Decathlon fiyat/performans konusunda gerçekten iyi. Spor malzemeleri hem kaliteli hem uygun fiyatlı!',
      companyId: companies[9].id,
      userId: users[0].id,
    },
    {
      text: 'Migros Money kart avantajları süper. Her alışverişte puan kazanıyorum. Çok memnunum!',
      companyId: companies[0].id,
      userId: users[2].id,
    },
    {
      text: 'Türk Telekom BiP uygulaması çok kullanışlı. Arkadaşlarımla ücretsiz görüntülü konuşuyoruz. Harika!',
      companyId: companies[1].id,
      userId: users[3].id,
    },
    {
      text: 'Starbucks Reserve Zorlu mağazası muhteşem. Özel kahveler çok lezzetli. Denemenizi tavsiye ederim!',
      companyId: companies[2].id,
      userId: users[4].id,
    },
    {
      text: 'Hepsiburada Premium üyelik gerçekten değerli. Kargo bedava ve çok hızlı. Kesinlikle değer!',
      companyId: companies[3].id,
      userId: users[0].id,
    },
    {
      text: 'Zara online alışveriş deneyimi mükemmel. Web sitesi çok kullanıcı dostu. Kolay alışveriş!',
      companyId: companies[4].id,
      userId: users[1].id,
    },
    {
      text: 'THY Miles&Smiles programı çok avantajlı. Mil biriktirip ücretsiz bilet aldım. Harika bir sistem!',
      companyId: companies[5].id,
      userId: users[2].id,
    },
    {
      text: 'Yemeksepeti kampanyalar sayfası süper. Her gün farklı restoranlardan indirimli yemek sipariş ediyorum!',
      companyId: companies[6].id,
      userId: users[3].id,
    },
    {
      text: 'Teknosa taksit seçenekleri çok uygun. 12 aya kadar taksit imkanı var. Bütçeme çok uygun!',
      companyId: companies[7].id,
      userId: users[4].id,
    },
    {
      text: 'Arçelik müşteri hizmetleri her zaman ulaşılabilir. Sorunlarıma hemen çözüm buluyorlar. Teşekkürler!',
      companyId: companies[8].id,
      userId: users[0].id,
    },
    {
      text: 'Decathlon bisiklet kategorisi çok zengin. Her bütçeye uygun model var. Kesinlikle bakın!',
      companyId: companies[9].id,
      userId: users[1].id,
    },
  ];

  const thanks = await Promise.all(
    thanksData.map((data) =>
      prisma.thanks.create({
        data,
      })
    )
  );

  console.log(`✅ Created ${thanks.length} thanks posts`);

  // Create some likes
  await Promise.all([
    prisma.like.create({
      data: { userId: users[1].id, thanksId: thanks[0].id },
    }),
    prisma.like.create({
      data: { userId: users[2].id, thanksId: thanks[0].id },
    }),
    prisma.like.create({
      data: { userId: users[3].id, thanksId: thanks[1].id },
    }),
    prisma.like.create({
      data: { userId: users[0].id, thanksId: thanks[2].id },
    }),
    prisma.like.create({
      data: { userId: users[4].id, thanksId: thanks[3].id },
    }),
  ]);

  // Update like counts
  for (let i = 0; i < 5; i++) {
    const likeCount = await prisma.like.count({
      where: { thanksId: thanks[i].id },
    });
    await prisma.thanks.update({
      where: { id: thanks[i].id },
      data: { likeCount },
    });
  }

  console.log('✅ Created sample likes');

  // Create some comments
  await Promise.all([
    prisma.comment.create({
      data: {
        userId: users[1].id,
        thanksId: thanks[0].id,
        text: 'Ben de aynı şubeden alışveriş yapıyorum, gerçekten çalışanlar çok yardımcı!',
      },
    }),
    prisma.comment.create({
      data: {
        userId: users[2].id,
        thanksId: thanks[0].id,
        text: 'Elif hanımı tanıyorum, çok nazik biri 😊',
      },
    }),
    prisma.comment.create({
      data: {
        userId: users[0].id,
        thanksId: thanks[1].id,
        text: 'Müşteri hizmetleri numarası kaç? Ben de aramak istiyorum.',
      },
    }),
  ]);

  console.log('✅ Created sample comments');

  // Create some company follows
  await Promise.all([
    prisma.followCompany.create({
      data: { userId: users[0].id, companyId: companies[0].id },
    }),
    prisma.followCompany.create({
      data: { userId: users[0].id, companyId: companies[2].id },
    }),
    prisma.followCompany.create({
      data: { userId: users[1].id, companyId: companies[1].id },
    }),
    prisma.followCompany.create({
      data: { userId: users[2].id, companyId: companies[3].id },
    }),
  ]);

  console.log('✅ Created company follows');

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
