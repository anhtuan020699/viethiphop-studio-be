import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const galleryCount = await prisma.aboutGalleryImage.count();
  if (galleryCount === 0) {
    await prisma.aboutGalleryImage.createMany({
      data: [
        { src: '/images/studio-cover.webp', caption: 'Không gian Việt Hiphop Studio', order: 1 },
        { src: '/images/studio_mixing.png', caption: 'Bàn mix & phòng điều khiển', order: 2 },
      ],
    });
    console.log('About gallery seeded');
  } else {
    console.log('About gallery already has data');
  }

  const gearCount = await prisma.gearCategory.count();
  if (gearCount === 0) {
    const gearSeed = [
      {
        title: 'Microphones',
        icon: 'Mic2',
        order: 1,
        items: [
          'Neumann U87 Ai (Large-diaphragm Condenser)',
          'Rode NT1-A (Signature Vocal Mic)',
          'Shure SM7B (Dynamic Broadcast & Rap Vocal)',
          'AKG C214 (Percussion & Acoustic)',
        ],
      },
      {
        title: 'Audio Interface & Preamps',
        icon: 'Cpu',
        order: 2,
        items: [
          'Universal Audio Apollo x6 Thunderbolt 3',
          'Neve 1073 SPX Mono Mic Preamp & EQ',
          'Warm Audio WA-2A Tube Optical Compressor',
          'UAD DSP Real-time Processing',
        ],
      },
      {
        title: 'Monitoring & Acoustics',
        icon: 'Speaker',
        order: 3,
        items: [
          'Yamaha HS8 Studio Monitors',
          'Focal Shape 65 Nearfield Monitors',
          'Yamaha HS8S Active Subwoofer',
          'Xử lý tiêu âm & bass trap chuẩn âm học phòng thu',
        ],
      },
      {
        title: 'DAWs & High-End Plugins',
        icon: 'Radio',
        order: 4,
        items: [
          'Pro Tools Studio / Logic Pro X / FL Studio',
          'FabFilter Total Bundle, Soundtoys 5',
          'Universal Audio (UAD) Signature Collection',
          'Antares Auto-Tune Pro & Celemony Melodyne 5',
        ],
      },
    ];
    for (const cat of gearSeed) {
      await prisma.gearCategory.create({
        data: {
          title: cat.title,
          icon: cat.icon,
          order: cat.order,
          items: {
            create: cat.items.map((name, index) => ({ name, order: index + 1 })),
          },
        },
      });
    }
    console.log('Gear categories seeded');
  } else {
    console.log('Gear already has data');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
