const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Tüm teşekkürler onaylanıyor...');
  
  const result = await prisma.thanks.updateMany({
    where: { isApproved: false },
    data: { isApproved: true },
  });
  
  console.log(`✅ ${result.count} teşekkür onaylandı!`);
  
  const total = await prisma.thanks.count();
  const approved = await prisma.thanks.count({
    where: { isApproved: true }
  });
  
  console.log(`\nToplam teşekkür: ${total}`);
  console.log(`Onaylanmış: ${approved}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.error('Hata:', error);
    prisma.$disconnect();
  });
