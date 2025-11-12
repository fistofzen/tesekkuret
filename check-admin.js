const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const adminUsers = await prisma.user.findMany({
      where: { isAdmin: true },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    console.log('\n=== Admin Kullanıcılar ===\n');
    if (adminUsers.length === 0) {
      console.log('❌ Hiç admin kullanıcı yok!\n');
      console.log('Admin kullanıcı oluşturmak için:');
      console.log('1. Prisma Studio\'yu aç: npx prisma studio');
      console.log('2. Users tablosuna git');
      console.log('3. Bir kullanıcının isAdmin alanını true yap\n');
    } else {
      adminUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name || 'İsimsiz'}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   ID: ${user.id}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
