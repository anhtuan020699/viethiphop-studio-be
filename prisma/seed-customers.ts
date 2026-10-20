import { PrismaClient } from '@prisma/client';

const rankings = [
  { rank: 1, name: 'Minh Khoa', note: 'Rap "Đêm Sài Gòn" — thu và mix tại studio', avatar: 'https://picsum.photos/id/64/400/400' },
  { rank: 2, name: 'Hoàng Long', note: 'Single "Không Về" phát hành quý 1', avatar: 'https://picsum.photos/id/91/400/400' },
  { rank: 3, name: 'Tuấn Kiệt', note: 'Beat độc quyền và vocal tuning', avatar: 'https://picsum.photos/id/177/400/400' },
  { rank: 4, name: 'Ngọc Anh', note: 'Ballad "Lời chưa nói"', avatar: 'https://picsum.photos/id/338/400/400' },
  { rank: 5, name: 'Đức Huy', note: 'Track "Streetlight" — trap melodic', avatar: 'https://picsum.photos/id/399/400/400' },
  { rank: 6, name: 'Phương Linh', note: 'Cover đêm mưa, thu vocal 2 ca', avatar: 'https://picsum.photos/id/453/400/400' },
  { rank: 7, name: 'Quang Minh', note: 'Live session tháng 3', avatar: 'https://picsum.photos/id/823/400/400' },
  { rank: 8, name: 'Bảo Trâm', note: 'Vocal ballad và bè', avatar: 'https://picsum.photos/id/836/400/400' },
  { rank: 9, name: 'Hải Đăng', note: 'Cypher room cùng nhóm bạn', avatar: 'https://picsum.photos/id/1011/400/400' },
  { rank: 10, name: 'Mai Chi', note: 'Demo đầu tay, gói thu âm cơ bản', avatar: 'https://picsum.photos/id/1027/400/400' },
];

const highlights = [
  { month: 1, name: 'Minh Khoa', caption: 'Buổi thu vocal đầu năm', image: 'https://picsum.photos/id/1015/900/1100', order: 1 },
  { month: 1, name: 'Hoàng Long', caption: 'Chụp sau khi chốt bản mix', image: 'https://picsum.photos/id/106/900/1100', order: 2 },
  { month: 2, name: 'Ngọc Anh', caption: 'Không gian thu ballad', image: 'https://picsum.photos/id/160/900/1100', order: 1 },
  { month: 3, name: 'Tuấn Kiệt', caption: 'Live session phòng thu', image: 'https://picsum.photos/id/169/900/1100', order: 1 },
  { month: 3, name: 'Quang Minh', caption: 'Khách và ekip sau ca thu', image: 'https://picsum.photos/id/180/900/1100', order: 2 },
  { month: 4, name: 'Đức Huy', caption: 'Setup mic cho track trap', image: 'https://picsum.photos/id/201/900/1100', order: 1 },
  { month: 5, name: 'Phương Linh', caption: 'Ảnh nổi bật tháng 5', image: 'https://picsum.photos/id/203/900/1100', order: 1 },
  { month: 6, name: 'Bảo Trâm', caption: 'Giữa năm — ca vocal bè', image: 'https://picsum.photos/id/237/900/1100', order: 1 },
  { month: 6, name: 'Mai Chi', caption: 'Lần đầu vào phòng thu', image: 'https://picsum.photos/id/342/900/1100', order: 2 },
  { month: 7, name: 'Hải Đăng', caption: 'Cypher cuối tuần', image: 'https://picsum.photos/id/349/900/1100', order: 1 },
  { month: 8, name: 'Minh Khoa', caption: 'Quay lại thu part 2', image: 'https://picsum.photos/id/433/900/1100', order: 1 },
  { month: 9, name: 'Hoàng Long', caption: 'Ảnh khách tháng 9', image: 'https://picsum.photos/id/550/900/1100', order: 1 },
  { month: 10, name: 'Tuấn Kiệt', caption: 'Phòng điều khiển sau mix', image: 'https://picsum.photos/id/593/900/1100', order: 1 },
  { month: 11, name: 'Ngọc Anh', caption: 'Buổi chụp cùng ekip', image: 'https://picsum.photos/id/659/900/1100', order: 1 },
  { month: 12, name: 'Cả nhóm khách 2026', caption: 'Khép lại một năm tại studio', image: 'https://picsum.photos/id/1033/900/1100', order: 1 },
];

const clips = [
  { category: 'feedback', title: 'Feedback sau bản mix "Đêm Sài Gòn"', customerName: 'Minh Khoa', youtubeUrl: 'https://www.youtube.com/embed/EcFJ8hVQx9Y', order: 1 },
  { category: 'feedback', title: 'Khách nói về buổi thu đầu tiên', customerName: 'Mai Chi', youtubeUrl: 'https://www.youtube.com/embed/qW-KwS4Hvp8', order: 2 },
  { category: 'livesession', title: 'Live session phòng thu — tháng 3', customerName: 'Quang Minh', youtubeUrl: 'https://www.youtube.com/embed/Fg2sVl-1VIk', order: 1 },
  { category: 'livesession', title: 'Live acoustic ballad', customerName: 'Ngọc Anh', youtubeUrl: 'https://www.youtube.com/embed/9bZkp7q19f0', order: 2 },
  { category: 'recording', title: 'Quá trình thu vocal trap', customerName: 'Đức Huy', youtubeUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk', order: 1 },
  { category: 'recording', title: 'Hậu trường thu bè và ad-lib', customerName: 'Bảo Trâm', youtubeUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ', order: 2 },
];

export async function seedCustomers(prisma: PrismaClient) {
  await prisma.customerRanking.deleteMany({});
  await prisma.customerHighlight.deleteMany({});
  await prisma.customerClip.deleteMany({});

  await prisma.customerRanking.createMany({
    data: rankings.map((item) => ({ ...item, year: 2026, isActive: true })),
  });
  await prisma.customerHighlight.createMany({
    data: highlights.map((item) => ({ ...item, year: 2026, isActive: true })),
  });
  await prisma.customerClip.createMany({
    data: clips.map((item) => ({ ...item, isActive: true })),
  });

  console.log('Customer seed done: 10 rankings, 15 highlights, 6 clips');
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
