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
      {
        title: 'Gunna x Lil Tjay Type Beat "Lost"',
        originalPrice: 1500000,
        discountedPrice: null,
        status: 'available',
        youtubeUrl: 'https://www.youtube.com/embed/EcFJ8hVQx9Y',
        genre: 'Hiphop',
        subgenre: 'Trap',
        typeBeat: 'Gunna',
      },
      {
        title: 'Vũ. Type Beat "Ánh Dương" | Prod by Công Phúc',
        originalPrice: 2000000,
        discountedPrice: 1500000,
        status: 'available',
        youtubeUrl: 'https://www.youtube.com/embed/qW-KwS4Hvp8',
        genre: 'Pop',
        subgenre: 'Ballad',
        typeBeat: 'Vũ.',
      },
      {
        title: '(SOLD) VSTRA Type Beat "Letters" | Beat by Công Phúc',
        originalPrice: 1500000,
        discountedPrice: null,
        status: 'sold',
        youtubeUrl: 'https://www.youtube.com/embed/Fg2sVl-1VIk',
        genre: 'RnB',
        subgenre: 'Melodic',
        typeBeat: 'VSTRA',
      },
      {
        title: '(SOLD) Juice WRLD Type Beat "Forever" | Beat by Gavies',
        originalPrice: 2000000,
        discountedPrice: null,
        status: 'sold',
        youtubeUrl: 'https://www.youtube.com/embed/8EZToxzvfGQ',
        genre: 'Hiphop',
        subgenre: 'Melodic',
        typeBeat: 'Juice WRLD',
      },
      {
        title: '(SOLD) Low G x Bruno Mars Type Beat "Summer Night" | Prod by Công Phúc',
        originalPrice: 2500000,
        discountedPrice: null,
        status: 'sold',
        youtubeUrl: 'https://www.youtube.com/embed/7jr8-0LRwZY',
        genre: 'Hiphop',
        subgenre: 'G Funk',
        typeBeat: 'Low G',
      },
    ],
  });
  console.log('✅ Beats seeded!');

  // Seed Mix Tracks (Separate Table)
  await prisma.mixTrack.deleteMany({});
  await prisma.mixTrack.createMany({
    data: [
      {
        title: 'Đêm Nay Ta Đi Đâu',
        artist: "Lil' G ft. Young T",
        packageType: 'Chuyên nghiệp',
        category: 'Nhạc phát hành',
        subCategory: 'Rap',
        youtubeUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
        description: 'Vocal tuning Melodyne, 808 Analog Saturation, Loudness -14 LUFS Spotify',
        order: 1,
      },
      {
        title: 'Có Khi Nào Rời Xa (RnB Re-work)',
        artist: 'Hà My',
        packageType: 'Nâng cao',
        category: 'Nhạc phát hành',
        subCategory: 'RnB',
        youtubeUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
        description: 'Stereo Width Reverb, Harmonic Exciter, Warm Vocal Tone',
        order: 2,
      },
      {
        title: 'Ngày Chung Đôi (Wedding Special)',
        artist: 'Vũ Phong & Thu Thảo',
        packageType: 'Nâng cao',
        category: 'Cover',
        subCategory: 'Nhạc cưới',
        youtubeUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
        description: 'Song ca Vocal Alignment, Dynamic EQ, Hậu kỳ ấm áp cho tiệc cưới',
        order: 3,
      },
      {
        title: 'Chỉ Cần Em Hạnh Phúc',
        artist: 'Quang Huy',
        packageType: 'Nâng cao',
        category: 'Nhạc phát hành',
        subCategory: 'Ballad',
        youtubeUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
        description: 'Piano & Vocal Acoustic Compression, Reverb Lexicon Hall',
        order: 4,
      },
      {
        title: 'TVC Quảng Cáo Sneaker Streetwear Campaign',
        artist: 'VietHiphop Production Lab',
        packageType: 'Chuyên nghiệp',
        category: 'TVC',
        youtubeUrl: 'https://www.youtube.com/embed/L_LUpnjgPso',
        description: 'Sound Design, Sub-drop FX, Master đanh lực tối đa cho loa điện thoại & màn LED',
        order: 5,
      },
      {
        title: 'Chuyện Hoa Sim',
        artist: 'Thanh Hằng',
        packageType: 'Cơ bản',
        category: 'Cover',
        subCategory: 'Trữ tình',
        youtubeUrl: 'https://www.youtube.com/embed/2Vv-BfVoq4g',
        description: 'Lọc nhiễu phòng thu, cân bằng âm lượng tự nhiên, giữ trọn chất giọng mộc',
        order: 6,
      },
      {
        title: 'Nối Vòng Tay Lớn (Acoustic Cypher)',
        artist: 'CLB Hiphop Sài Gòn',
        packageType: 'Chuyên nghiệp',
        category: 'Cover',
        subCategory: 'Tốp ca',
        youtubeUrl: 'https://www.youtube.com/embed/OPf0YbXqDm0',
        description: 'Xử lý đa micro, tách bạch 6 vocal, stereo imaging cân đối',
        order: 7,
      },
      {
        title: "Podcast 'Hiphop Không Ngủ' — Tập 05",
        artist: 'Host Minh Trí',
        packageType: 'Cơ bản',
        category: 'Giọng đọc',
        youtubeUrl: 'https://www.youtube.com/embed/hT_nvWreIhg',
        description: 'De-esser chống chói, Noise gate lọc sạch tạp âm, chuẩn âm lượng podcast -16 LUFS',
        order: 8,
      },
      {
        title: 'Nắng Chiều Bên Hiên',
        artist: 'Minh Quân ft. Bảo Anh',
        packageType: 'Cơ bản',
        category: 'Nhạc phát hành',
        subCategory: 'Pop',
        youtubeUrl: 'https://www.youtube.com/embed/uelHwf8o7_U',
        description: 'Bắt tai, tươi sáng, tối ưu cho TikTok & YouTube Shorts',
        order: 9,
      },
      {
        title: 'TVC Ra Mắt Nước Uống Tăng Lực Booster',
        artist: 'Agency & Việt Hiphop Studio',
        packageType: 'Chuyên nghiệp',
        category: 'TVC',
        youtubeUrl: 'https://www.youtube.com/embed/CevxZvSJLk8',
        description: 'Mixing Beat Trap sôi động kết hợp Voice-over dõng dạc, nén đa băng tần',
        order: 10,
      },
    ],
  });
  console.log('✅ Mix Tracks seeded into separate table!');

  // Seed Events / News
  await prisma.event.deleteMany({});
  await prisma.event.createMany({
    data: [
      {
        slug: 'workshop-new-artist-vhh',
        title: 'Chuỗi Workshop Miễn Phí Dành Cho New Artist: Làm Chủ Mixing & Định Hình Màu Sắc',
        description: 'Việt Hiphop Studio chính thức khởi động chuỗi Workshop hoàn toàn miễn phí dành riêng cho các nghệ sĩ mới, giải mã kỹ thuật Mixing & Mastering và bí quyết định hình chất riêng.',
        content: `Bắt đầu hành trình làm nhạc chưa bao giờ là điều dễ dàng đối với các nghệ sĩ trẻ độc lập. Từ việc loay hoay trong khâu xử lý âm thanh, chưa biết làm sao để vocal hòa quyện vào beat, cho đến việc tìm kiếm phong cách âm nhạc đặc trưng mang dấu ấn của riêng mình.

Thấu hiểu những trăn trở đó, Việt Hiphop Studio chính thức phát động chuỗi Workshop HOÀN TOÀN MIỄN PHÍ dành riêng cho NEW ARTIST tại TP.HCM. Đây là không gian cởi mở để các bạn gặp gỡ trực tiếp các Kỹ sư âm thanh (Sound Engineer) và Producer giàu kinh nghiệm của Studio, cùng mổ xẻ sản phẩm và nâng cấp kỹ năng làm nhạc thực chiến.

Nội dung trọng tâm gồm 3 chuyên đề:
1. HIỂU HƠN VỀ MIXING & MASTERING: Bóc tách chất lượng âm thanh các bài nhạc hit, nghe và góp ý trực tiếp trên sản phẩm demo của bạn.
2. ĐI TÌM MÀU SẮC RIÊNG TRONG ÂM NHẠC: Phân tích Case Study nghệ sĩ, định hình Artist Identity và kỹ năng phát triển vocal.
3. MINI JAM & LIVE SESSION: Live session tại phòng thu để thử nghiệm demo tâm đắc nhất và giao lưu cùng cộng đồng.

Thời gian: 19:00 - 21:00 Thứ 5 hàng tuần
Địa điểm: Việt Hiphop Studio — 435/284/25 Phạm Văn Đồng, TP.HCM
Chi phí: Hoàn toàn miễn phí (giới hạn 15 slot/buổi để đảm bảo tương tác 1-on-1).`,
        image: '/images/studio_mixing.png',
        category: 'Sự kiện',
        author: 'Việt Hiphop Studio Team',
        order: 1,
      },
      {
        slug: 'workshop-beat-mixing-2026',
        title: 'Workshop Chuyên Sâu: Kỹ Thuật Mix Beat & Xử Lý Vocal Rap Hiện Đại',
        description: 'Buổi chia sẻ thực chiến cùng Sound Engineer tại phòng thu về cách cân bằng âm lượng 808 & Kick, kỹ thuật sử dụng Auto-tune mượt mà và mẹo làm vocal nổi bật trên beat.',
        content: `Trong âm nhạc hiện đại, việc xử lý dải trầm (808 và Kick) đóng vai trò quyết định đến độ uy lực của một bản nhạc. Workshop sẽ hướng dẫn kỹ thuật sidechain compression, EQ dynamic và bão hòa analog (saturation) để tiếng bass tròn trịa mà không lấn át vocal.

Ngoài ra, các kỹ sư âm thanh tại phòng thu sẽ trực tiếp thị phạm cách tune giọng bằng Antares Auto-Tune và Melodyne sao cho tự nhiên, mượt mà mà vẫn giữ trọn cảm xúc.

Thời gian: 14:00 - 17:30 ngày 25 Tháng 10, 2026
Địa điểm: Việt Hiphop Studio — 435/284/25 Phạm Văn Đồng, TP.HCM`,
        image: '/images/studio_mic.png',
        category: 'Sự kiện',
        author: 'Sound Engineer Team',
        order: 2,
      },
      {
        slug: 'cypher-session-night',
        title: 'Viet Hiphop Cypher Session: Đêm Thu Âm & Giao Lưu Nghệ Sĩ Trẻ Sài Gòn',
        description: 'Sân chơi âm nhạc định kỳ kết nối các Rapper, Singer và Beatmaker tài năng tại TP.HCM. Thu âm trực tiếp cypher track và phát hành trên các kênh truyền thông của Studio.',
        content: `Cypher Session là đêm gặp gỡ thân mật giữa các nghệ sĩ underground và mainstream. Không gian phòng thu mở cửa để các bạn thả mic, thử verse mới trên những con beat độc quyền do chính Studio sản xuất.

Tất cả các phần thu âm hay nhất trong đêm sẽ được ghi hình và đăng tải trên kênh chính thức của Việt Hiphop Studio.`,
        image: '/images/studio_space.png',
        category: 'Sự kiện',
        author: 'Việt Hiphop Event Team',
        order: 3,
      },
      {
        slug: 'nang-cap-thiet-bi-phong-thu-2026',
        title: 'Việt Hiphop Studio Hoàn Tất Nâng Cấp Hệ Thống Microphone & Preamp Analog Mới',
        description: 'Trang bị thêm Neumann U87 Ai, Preamp Neve 1073 và hệ thống tiêu âm cách âm chuẩn quốc tế phục vụ các dự án âm nhạc chuyên nghiệp.',
        content: `Để mang lại chất lượng bản thu tốt nhất cho các nghệ sĩ, Việt Hiphop Studio vừa hoàn tất đợt nâng cấp toàn diện trang thiết bị phòng thu tháng 10/2026.

Hệ thống bổ sung gồm microphone huyền thoại Neumann U87 Ai, Preamp analog Neve 1073 Dual, loa kiểm âm Genelec The Ones cùng hệ thống xử lý âm học bass trap cải tiến. Mời các nghệ sĩ ghé trải nghiệm không gian âm thanh mới!`,
        image: '/images/studio_mixing.png',
        category: 'Tin tức',
        author: 'Ban Quản Trị Studio',
        order: 4,
      },
      {
        slug: 'uu-dai-thu-am-thang-10-2026',
        title: 'Ưu Đãi Tháng 10: Giảm 20% Dịch Vụ Thu Âm Kỷ Niệm & Nhạc Cưới',
        description: 'Mừng mùa cưới 2026, Việt Hiphop Studio tặng ưu đãi giảm 20% cho toàn bộ gói thu âm Nhạc kỷ niệm và Nhạc cưới. Đặt lịch ngay để nhận ngay mức giá ưu đãi đặc biệt.',
        content: `Nhân dịp mùa cưới và kỷ niệm cuối năm 2026, Việt Hiphop Studio dành tặng ưu đãi đặc biệt:

🎁 GIẢM 20% tất cả gói Thu âm Nhạc kỷ niệm (tặng quà, kỷ niệm ngày đặc biệt, lời chúc bằng âm nhạc)
🎁 GIẢM 20% tất cả gói Thu âm Nhạc cưới (song ca, lời thề, tiệc cưới)

Thời gian áp dụng: 01/10/2026 – 31/10/2026

Cách nhận ưu đãi: Đặt lịch qua Messenger hoặc gọi trực tiếp hotline 033 307 0996, báo mã ưu đãi ĐẶC BIỆT THÁNG 10 khi đặt lịch.

Số lượng slot có hạn, ưu tiên khách đặt lịch sớm!`,
        image: '/images/studio_mixing.png',
        category: 'Ưu đãi',
        author: 'Việt Hiphop Studio Team',
        order: 5,
      },
    ],
  });
  console.log('✅ Events / News seeded successfully!');

  const galleryCount = await prisma.aboutGalleryImage.count();
  if (galleryCount === 0) {
    await prisma.aboutGalleryImage.createMany({
      data: [
        { src: '/images/studio-cover.webp', caption: 'Không gian Việt Hiphop Studio', order: 1 },
        { src: '/images/studio_mixing.png', caption: 'Bàn mix & phòng điều khiển', order: 2 },
      ],
    });
    console.log('✅ About gallery seeded!');
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
    console.log('✅ Gear categories seeded!');
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
