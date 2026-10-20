import { PrismaClient } from '@prisma/client';

const rankings = [
  { rank: 1, name: 'Nguyễn Văn A', stageName: 'CCMK', recordingCount: 15, beatCount: 0 },
  { rank: 2, name: 'Trần Thị B', stageName: 'Kzix', recordingCount: 7, beatCount: 1 },
  { rank: 3, name: 'Lê Hoàng Nam', stageName: 'NamLee', recordingCount: 11, beatCount: 2 },
  { rank: 4, name: 'Phạm Ngọc Anh', stageName: 'Annie P', recordingCount: 6, beatCount: 0 },
  { rank: 5, name: 'Đỗ Đức Huy', stageName: 'HuyD', recordingCount: 9, beatCount: 3 },
  { rank: 6, name: 'Võ Phương Linh', stageName: 'Lin', recordingCount: 4, beatCount: 1 },
  { rank: 7, name: 'Bùi Quang Minh', stageName: 'QMinh', recordingCount: 8, beatCount: 0 },
  { rank: 8, name: 'Ngô Bảo Trâm', stageName: 'Tram', recordingCount: 5, beatCount: 2 },
  { rank: 9, name: 'Hồ Hải Đăng', stageName: 'DangH', recordingCount: 3, beatCount: 4 },
  { rank: 10, name: 'Mai Chi', stageName: 'ChiMai', recordingCount: 2, beatCount: 0 },
];

const highlights = [
  { name: 'Minh Khoa', caption: 'Buổi thu vocal đầu năm', image: 'https://picsum.photos/id/1015/1200/800', order: 1 },
  { name: 'Hoàng Long', caption: 'Chụp sau khi chốt bản mix', image: 'https://picsum.photos/id/106/1200/800', order: 2 },
  { name: 'Ngọc Anh', caption: 'Không gian thu ballad', image: 'https://picsum.photos/id/160/1200/800', order: 3 },
  { name: 'Tuấn Kiệt', caption: 'Live session phòng thu', image: 'https://picsum.photos/id/169/1200/800', order: 4 },
  { name: 'Quang Minh', caption: 'Khách và ekip sau ca thu', image: 'https://picsum.photos/id/180/1200/800', order: 5 },
  { name: 'Đức Huy', caption: 'Setup mic cho track trap', image: 'https://picsum.photos/id/201/1200/800', order: 6 },
  { name: 'Phương Linh', caption: 'Ảnh khách trong phòng thu', image: 'https://picsum.photos/id/203/1200/800', order: 7 },
  { name: 'Bảo Trâm', caption: 'Ca vocal bè', image: 'https://picsum.photos/id/237/1200/800', order: 8 },
  { name: 'Mai Chi', caption: 'Lần đầu vào phòng thu', image: 'https://picsum.photos/id/342/1200/800', order: 9 },
  { name: 'Hải Đăng', caption: 'Cypher cuối tuần', image: 'https://picsum.photos/id/349/1200/800', order: 10 },
  { name: 'Minh Khoa', caption: 'Quay lại thu part 2', image: 'https://picsum.photos/id/433/1200/800', order: 11 },
  { name: 'Cả nhóm khách', caption: 'Một năm tại studio', image: 'https://picsum.photos/id/1033/1200/800', order: 12 },
];

const clips = [
  { category: 'feedback', title: 'Feedback sau bản mix "Đêm Sài Gòn"', customerName: 'Minh Khoa', youtubeUrl: 'https://www.youtube.com/embed/EcFJ8hVQx9Y', order: 1 },
  { category: 'feedback', title: 'Khách nói về buổi thu đầu tiên', customerName: 'Mai Chi', youtubeUrl: 'https://www.youtube.com/embed/qW-KwS4Hvp8', order: 2 },
  { category: 'livesession', title: 'Live session phòng thu — tháng 3', customerName: 'Quang Minh', youtubeUrl: 'https://www.youtube.com/embed/Fg2sVl-1VIk', order: 1 },
  { category: 'livesession', title: 'Live acoustic ballad', customerName: 'Ngọc Anh', youtubeUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', order: 2 },
  { category: 'recording', title: 'Quá trình thu vocal trap', customerName: 'Đức Huy', youtubeUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk', order: 1 },
  { category: 'recording', title: 'Hậu trường thu bè và ad-lib', customerName: 'Bảo Trâm', youtubeUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ', order: 2 },
  { category: 'compare', title: 'So sánh vocal trước và sau mix', customerName: 'Hoàng Long', youtubeUrl: 'https://www.youtube.com/embed/EcFJ8hVQx9Y', order: 1 },
];

export async function seedCustomers(prisma: PrismaClient) {
  await prisma.customerRanking.deleteMany({});
  await prisma.customerHighlight.deleteMany({});
  await prisma.customerClip.deleteMany({});

  await prisma.customerRanking.createMany({
    data: rankings.map((item) => ({ ...item, year: 2026, isActive: true })),
  });
  await prisma.customerHighlight.createMany({
    data: highlights.map((item) => ({ ...item, year: 2026, month: 0, isActive: true })),
  });
  await prisma.customerClip.createMany({
    data: clips.map((item) => ({ ...item, isActive: true })),
  });

  console.log(`Customer seed done: ${rankings.length} rankings, ${highlights.length} highlights, ${clips.length} clips`);
}

if (process.argv[1]?.includes('seed-customers')) {
  const prisma = new PrismaClient();
  seedCustomers(prisma)
    .catch((error) => {
      console.error(error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
