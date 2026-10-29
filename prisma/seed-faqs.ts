import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FAQs...');

  // FAQ cho trang Beats
  const beatsFaqs = [
    {
      question: 'Beat là gì?',
      answer: 'Beat là nền nhạc (instrumental) được tạo nên bởi các giai điệu, nhạc nền và bộ trống. Bạn có thể dùng beat này để sáng tác hoặc thu âm giọng hát của mình.',
      category: 'beats',
      order: 1,
    },
    {
      question: 'Tôi có thể dùng beat này cho mục đích gì?',
      answer: 'Beat có thể dùng cho: sáng tác bài hát, thu âm demo, livestream âm nhạc, hoặc phát hành chính thức. Tùy loại beat (cơ bản hay độc quyền) mà có điều kiện sử dụng khác nhau.',
      category: 'beats',
      order: 2,
    },
    {
      question: 'Beat cơ bản vs độc quyền có gì khác?',
      answer: 'Beat cơ bản: nhiều người có thể mua và dùng. Beat độc quyền: chỉ bạn được phép dùng, người khác không được. Beat độc quyền có giá cao hơn nhưng bảo vệ tác quyền tốt hơn.',
      category: 'beats',
      order: 3,
    },
    {
      question: 'Mình có được phép bán sản phẩm dùng beat này không?',
      answer: 'Nếu beat cơ bản: có, bạn có thể bán nhưng phải chia tác quyền cho tác giả beat. Nếu beat độc quyền: có, 100% lợi nhuận là của bạn.',
      category: 'beats',
      order: 4,
    },
  ];

  // FAQ cho trang bảng giá (pricing)
  const pricingFaqs = [
    {
      question: 'Phòng cơ bản và Phòng nâng cao khác nhau như thế nào?',
      answer: 'Sẽ được cập nhật sau.',
      category: 'pricing',
      order: 1,
    },
    {
      question: 'Hình thức đặt lịch và thanh toán?',
      answer: 'Bạn có thể đặt lịch trước qua form Liên hệ hoặc qua facebook Việt Hiphop Studio hoặc gọi trực tiếp Hotline/Zalo 0333 070 996. Studio nhận cọc 100k để giữ phòng.',
      category: 'pricing',
      order: 2,
    },
    {
      question: 'Có thể gia hạn thêm giờ khi đang thu không?',
      answer: 'Có thể, tùy vào lịch của studio. Bạn nên thông báo trước để studio sắp xếp phù hợp. Giá gia hạn tính theo giá giờ đơn.',
      category: 'pricing',
      order: 3,
    },
    {
      question: 'Nếu hủy lịch có được hoàn cọc không?',
      answer: 'Nếu hủy trước 24h, studio sẽ hoàn lại tiền cọc. Nếu hủy trong vòng 24h trước giờ hẹn, tiền cọc sẽ không được hoàn lại.',
      category: 'pricing',
      order: 4,
    },
  ];

  // Xóa FAQs cũ nếu có
  await prisma.faq.deleteMany({});

  // Tạo FAQs mới
  for (const faq of [...beatsFaqs, ...pricingFaqs]) {
    await prisma.faq.create({
      data: faq,
    });
  }

  console.log('✅ FAQs seeded successfully!');
  console.log(`   - ${beatsFaqs.length} FAQs cho trang Beats`);
  console.log(`   - ${pricingFaqs.length} FAQs cho trang Bảng giá`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding FAQs:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
