/**
 * Migration script to update old R2 public URLs to use local proxy
 * Run with: npx tsx scripts/migrate-media-urls.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const OLD_R2_PUBLIC_URL = 'https://pub-f195f7189ace45b88dc3926757e99764.r2.dev';

async function migrateMediaUrls() {
  console.log('Starting media URL migration...\n');

  try {
    // Find all thanks with old R2 public URLs
    const thanksWithOldUrls = await prisma.thanks.findMany({
      where: {
        mediaUrl: {
          startsWith: OLD_R2_PUBLIC_URL,
        },
      },
      select: {
        id: true,
        mediaUrl: true,
      },
    });

    console.log(`Found ${thanksWithOldUrls.length} thanks with old R2 URLs\n`);

    if (thanksWithOldUrls.length === 0) {
      console.log('No migration needed!');
      return;
    }

    // Update each thanks record
    let updated = 0;
    for (const thanks of thanksWithOldUrls) {
      if (!thanks.mediaUrl) continue;

      // Extract the key (path after the base URL)
      const key = thanks.mediaUrl.replace(OLD_R2_PUBLIC_URL + '/', '');
      
      // New URL using local proxy
      const newUrl = `/api/media/${key}`;

      await prisma.thanks.update({
        where: { id: thanks.id },
        data: { mediaUrl: newUrl },
      });

      console.log(`✓ Updated: ${thanks.id}`);
      console.log(`  Old: ${thanks.mediaUrl}`);
      console.log(`  New: ${newUrl}\n`);

      updated++;
    }

    console.log(`\n✅ Migration completed! Updated ${updated} records.`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateMediaUrls()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
