import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FAQs...');

  // FAQ cho trang dịch vụ (services)
  const servicesFaqs = [
    {
      question: 'Phòng thu có những trang thiết bị gì?',
      answer: 'Studio được trang bị đầy đủ thiết bị chuyên nghiệp: Mic thu âm cao cấp (Neumann, Shure), Interface âm thanh chất lượng cao, Màn hình và hệ thống nghe chuẩn studio, phần mềm DAW (Logic Pro, Pro Tools), plugin và thiết bị xử lý âm thanh chuyên nghiệp.',
      category: 'services',
      order: 1,
    },
    {
      question: 'Tôi cần chuẩn bị gì trước khi đến studio?',
      answer: 'Bạn nên chuẩn bị lời bài hát (nếu thu âm), beat/nhạc nền (nếu có sẵn), và ý tưởng rõ ràng về sản phẩm muốn tạo ra. Studio sẽ hỗ trợ phần còn lại.',
      category: 'services',
      order: 2,
    },
    {
      question: 'Thời gian làm việc của studio là khi nào?',
      answer: 'Studio mở cửa từ 9h sáng đến 10h tối hàng ngày. Bạn có thể đặt lịch trước qua form Liên hệ hoặc gọi Hotline/Zalo 0333 070 996.',
      category: 'services',
      order: 3,
    },
    {
      question: 'Studio có hỗ trợ viết lời bài hát không?',
      answer: 'Có, studio có dịch vụ Sáng tác. Bạn chia sẻ ý tưởng, cảm xúc hoặc câu chuyện, và team sẽ cùng bạn phát triển thành ca khúc hoàn chỉnh.',
      category: 'services',
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
  for (const faq of [...servicesFaqs, ...pricingFaqs]) {
    await prisma.faq.create({
      data: faq,
    });
  }

  console.log('✅ FAQs seeded successfully!');
  console.log(`   - ${servicesFaqs.length} FAQs cho trang Dịch vụ`);
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
