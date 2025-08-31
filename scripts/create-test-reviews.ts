import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTestReviews() {
  try {
    // First, get existing users
    const users = await prisma.user.findMany();
    
    if (users.length === 0) {
      console.log('No users found. Creating test users first...');
      
      // Create test users
      const testUsers = [
        {
          email: 'user1@test.com',
          name: 'Anna Schmidt',
          role: 'USER' as const,
          password: 'password123'
        },
        {
          email: 'user2@test.com', 
          name: 'Minh Nguyen',
          role: 'USER_PREMIUM' as const,
          password: 'password123'
        },
        {
          email: 'user3@test.com',
          name: 'Peter Mueller',
          role: 'USER' as const,
          password: 'password123'
        },
        {
          email: 'user4@test.com',
          name: 'Linh Tran',
          role: 'USER_PREMIUM' as const,
          password: 'password123'
        },
        {
          email: 'user5@test.com',
          name: 'Hans Weber',
          role: 'USER' as const,
          password: 'password123'
        },
        {
          email: 'user6@test.com',
          name: 'Thu Hoang',
          role: 'USER' as const,
          password: 'password123'
        }
      ];

      for (const user of testUsers) {
        await prisma.user.create({
          data: user
        });
      }
      
      console.log('Test users created!');
    }

    // Get all users again
    const allUsers = await prisma.user.findMany();
    
    const testReviews = [
      {
        rating: 5,
        comment: 'Tuyệt vời! Tôi đã học được rất nhiều từ vựng tiếng Đức mới. Giao diện rất thân thiện và dễ sử dụng.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Die beste App zum Deutschlernen! Sehr systematisch und gut strukturiert. Danke für diese tolle Plattform!',
        isPublic: true
      },
      {
        rating: 4,
        comment: 'Ứng dụng rất hữu ích cho việc học tiếng Đức. Từ vựng được phân loại rất chi tiết và khoa học.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Ich liebe diese Lernplattform! Die Übungen sind abwechslungsreich und helfen mir sehr beim Vokabellernen.',
        isPublic: true
      },
      {
        rating: 4,
        comment: 'Cảm ơn team đã tạo ra một công cụ học tập tuyệt vời như vậy. Tôi đã cải thiện đáng kể khả năng tiếng Đức của mình.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Fantastisch! Die Kombination aus Deutsch und Vietnamesisch macht das Lernen sehr effektiv.',
        isPublic: true
      },
      {
        rating: 4,
        comment: 'Giao diện đẹp, nội dung chất lượng. Đặc biệt thích phần luyện tập từ vựng theo chủ đề.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Sehr empfehlenswert für alle Vietnamesen, die Deutsch lernen wollen. Gut durchdacht und professionell.',
        isPublic: true
      },
      {
        rating: 4,
        comment: 'Ứng dụng giúp tôi học từ vựng một cách có hệ thống. Rất thích phần phát âm và ví dụ câu.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Perfekt für das Selbststudium! Die Erklärungen sind klar und die Beispiele sehr hilfreich.',
        isPublic: true
      },
      {
        rating: 4,
        comment: 'Cảm ơn đội ngũ phát triển! Đây chính xác là những gì tôi cần để cải thiện tiếng Đức.',
        isPublic: true
      },
      {
        rating: 5,
        comment: 'Eine wunderbare Ergänzung zu meinem Deutschkurs. Die Vokabeln sind sehr praktisch und alltagsnah.',
        isPublic: true
      }
    ];

    // Create reviews
    for (let i = 0; i < testReviews.length; i++) {
      const user = allUsers[i % allUsers.length];
      const review = testReviews[i];
      
      // Calculate nextAllowedDate (365 days from now)
      const nextAllowedDate = new Date();
      nextAllowedDate.setDate(nextAllowedDate.getDate() + 365);
      
      await prisma.review.create({
        data: {
          ...review,
          userId: user.id,
          nextAllowedDate
        }
      });
    }

    console.log(`✅ Created ${testReviews.length} test reviews!`);
    
    // Show summary
    const reviewCount = await prisma.review.count();
    console.log(`📊 Total reviews in database: ${reviewCount}`);
    
  } catch (error) {
    console.error('❌ Error creating test reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestReviews();
