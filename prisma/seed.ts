import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@viethiphop.vn';
  const adminPassword = 'password123';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Super Admin',
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    console.log(`✅ Default admin created!`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } else {
    console.log('⚠️ Admin account already exists!');
  }

  // Seed Settings
  const settingsData = [
    { key: 'name', value: 'Việt Hiphop Studio' },
    { key: 'address', value: '435/284 Phạm Văn Đồng' },
    { key: 'locality', value: 'P. Bình Lợi Trung, TP.HCM' },
    { key: 'phone', value: '033 307 0996' },
    { key: 'email', value: 'viethiphop.contact@gmail.com' },
    { key: 'facebook', value: 'https://www.facebook.com/VietHiphopStudio/' },
    { key: 'messenger', value: 'https://www.messenger.com/t/116532993593050' },
    { key: 'maps', value: 'https://www.google.com/maps/search/?api=1&query=435%2F284%20Ph%E1%BA%A1m%20V%C4%83n%20%C4%90%E1%BB%93ng%2C%20B%C3%ACnh%20L%E1%BB%A3i%20Trung%2C%20Th%C3%A0nh%20ph%E1%BB%91%20H%E1%BB%93%20Ch%C3%AD%20Minh' },
    { key: 'cover', value: '/images/studio-cover.webp' },
    { key: 'logo', value: '/images/studio-logo.webp' }
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log('✅ Settings seeded!');

  // Seed Services
  const servicesData = [
    { slug: 'thu-am', number: '01', title: 'Thu âm', english: 'RECORDING', description: 'Một bản rap, một ca khúc tự viết hay món quà bằng âm nhạc. Bắt đầu với giọng hát và câu chuyện của bạn.', suitableFor: 'Rap, vocal, cover và ca khúc cá nhân', source: 'https://www.facebook.com/VietHiphopStudio/', isMain: true, order: 1 },
    { slug: 'phoi-khi', number: '02', title: 'Hòa âm phối khí', english: 'ARRANGEMENT', description: 'Tìm màu sắc và không gian âm nhạc cho giai điệu. Trao đổi cùng Studio để lựa chọn hướng phối phù hợp.', suitableFor: 'Ca khúc cần phần phối và màu sắc âm nhạc', source: 'https://www.facebook.com/VietHiphopStudio/', isMain: true, order: 2 },
    { slug: 'sang-tac', number: '03', title: 'Sáng tác', english: 'SONGWRITING', description: 'Bạn có một cảm xúc muốn kể thành lời? Chia sẻ ý tưởng để cùng tìm hướng phát triển thành ca khúc.', suitableFor: 'Ý tưởng bài hát, câu chuyện và cảm xúc riêng', source: 'https://www.facebook.com/VietHiphopStudio/', isMain: true, order: 3 },
    { slug: 'truyen-thong-chinh', number: '04', title: 'Truyền thông', english: 'MEDIA & PR', description: 'Chiến lược quảng bá và kết nối khán giả. Cùng định hướng để sản phẩm của bạn tiếp cận rộng rãi hơn.', suitableFor: 'Dự án phát hành và truyền thông', source: 'https://www.facebook.com/VietHiphopStudio/', isMain: true, order: 4 },
    { slug: 'phat-hanh', title: 'Phát hành', description: 'Trao đổi nhu cầu phát hành cho sản phẩm âm nhạc của bạn.', isMain: false, order: 5 },
    { slug: 'truyen-thong', title: 'Truyền thông', description: 'Chia sẻ định hướng giới thiệu sản phẩm và kết nối người nghe.', isMain: false, order: 6 },
    { slug: 'thue-khong-gian', title: 'Thuê không gian', description: 'Tìm không gian phù hợp cho kế hoạch làm việc và sáng tạo.', isMain: false, order: 7 },
  ];

  for (const svc of servicesData) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: svc,
    });
  }
  console.log('✅ Services seeded!');

  // Seed Media
  await prisma.media.deleteMany({});
  await prisma.media.createMany({
    data: [
      { src: '/images/studio-cover.webp', alt: 'Ảnh bìa chính thức của fanpage', title: 'Một góc Việt Hiphop Studio', category: 'Không gian', description: 'Ảnh bìa chính thức giới thiệu không gian Studio; Facebook gắn nhãn nội dung AI.', source: 'https://www.facebook.com/photo/?fbid=1563775912202077&set=a.579463330633345', objectPosition: 'center', order: 1 },
      { src: '/images/studio-visit.webp', alt: 'Khoảnh khắc khách ghé', title: 'Một điểm dừng cho sáng tạo', category: 'Không gian', description: 'Khoảnh khắc từ bài đăng giới thiệu dịch vụ cho thuê không gian.', source: 'https://www.facebook.com/VietHiphopStudio/posts/pfbid034g9e3aXP1Vqn3B7GyLzaUZ7bYSUS2r43ntMYH56wggditPM7p1WrsotJe9hcTL5wl', order: 2 },
      { src: '/images/studio-ballad.webp', alt: 'Hình ảnh Nho Thành tại Studio', title: 'Một chút ấm áp cùng ballad', category: 'Âm nhạc', description: 'Nho Thành và câu chuyện âm nhạc được chia sẻ trên fanpage.', source: 'https://www.facebook.com/VietHiphopStudio/posts/pfbid02664KBZqQsoPKxM7jBGHQjmEuRFmtDGjtnM5CaZ1Dv9dkEeHY7Y7UvbxgbrJ9Xra2l', order: 3 },
      { src: '/images/studio-rap.webp', alt: 'Chí Vỹ tại Việt Hiphop Studio', title: 'Khi câu chuyện được kể bằng rap', category: 'Âm nhạc', description: 'Chí Vỹ trở lại Studio với một bài rap love, theo bài đăng chính thức.', source: 'https://www.facebook.com/VietHiphopStudio/posts/pfbid0TQRhPC68P2XVy661MSajMPQGvZy2seRhmNRkCJ7btxmjFVufnr4r8L5sTtQ2fSZFl', order: 4 },
    ]
  });
  console.log('✅ Media seeded!');

  // Seed FAQs
  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({
    data: [
      { question: 'Lần đầu thu âm, tôi nên bắt đầu từ đâu?', answer: 'Bạn có thể chia sẻ bài hát, bản demo hoặc đơn giản là ý tưởng đang có. Studio sẽ trao đổi cùng bạn để xác định nhu cầu và hướng làm việc phù hợp.', order: 1 },
      { question: 'Studio có nhận các thể loại ngoài rap không?', answer: 'Fanpage Studio giới thiệu cả rap, ballad và những ca khúc dành tặng người thân. Hãy gửi bài tham khảo hoặc mô tả thể loại bạn muốn thực hiện để trao đổi cụ thể.', order: 2 },
      { question: 'Tôi có thể xem báo giá ở đâu?', answer: 'Liên hệ Studio và cho biết dịch vụ, phạm vi dự án cùng mong muốn của bạn để được tư vấn báo giá phù hợp.', order: 3 },
      { question: 'Làm thế nào để đặt lịch làm việc?', answer: 'Gửi nhu cầu và thời gian mong muốn qua Messenger hoặc gọi Studio. Lịch làm việc được thống nhất trực tiếp với Studio sau khi trao đổi.', order: 4 },
    ]
  });
  console.log('✅ FAQs seeded!');

  // Seed Beats
  await prisma.beat.deleteMany({});
  await prisma.beat.createMany({
    data: [
      { title: 'Gunna x Lil Tjay Type Beat "Lost"', originalPrice: 1500000, discountedPrice: null, status: 'available', youtubeUrl: 'https://www.youtube.com/embed/EcFJ8hVQx9Y' },
      { title: 'Vũ. Type Beat "Ánh Dương" | Prod by Công Phúc', originalPrice: 2000000, discountedPrice: 1500000, status: 'available', youtubeUrl: 'https://www.youtube.com/embed/qW-KwS4Hvp8' },
      { title: '(SOLD) VSTRA Type Beat "Letters" | Beat by Công Phúc', originalPrice: 1500000, discountedPrice: null, status: 'sold', youtubeUrl: 'https://www.youtube.com/embed/Fg2sVl-1VIk' },
      { title: '(SOLD) Juice WRLD Type Beat "Forever" | Beat by Gavies', originalPrice: 2000000, discountedPrice: null, status: 'sold', youtubeUrl: 'https://www.youtube.com/embed/8EZToxzvfGQ' },
      { title: '(SOLD) Low G x Bruno Mars Type Beat "Summer Night" | Prod by Công Phúc', originalPrice: 2500000, discountedPrice: null, status: 'sold', youtubeUrl: 'https://www.youtube.com/embed/7jr8-0LRwZY' },
    ]
  });
  console.log('✅ Beats seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
