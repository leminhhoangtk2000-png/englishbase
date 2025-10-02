const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkComments() {
  try {
    console.log('🔍 Kiểm tra database exercise_comments...\n');
    
    // Đếm tổng số comments
    const totalComments = await prisma.exercise_comments.count();
    console.log(`📊 Tổng số bình luận: ${totalComments}`);
    
    if (totalComments === 0) {
      console.log('\n❌ Chưa có bình luận nào trong database!');
      console.log('\n🔧 Cấu trúc table exercise_comments:');
      
      // Kiểm tra xem table có tồn tại không
      const tableExists = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'exercise_comments';
      `;
      
      console.log('Table exists:', tableExists.length > 0 ? '✅' : '❌');
      
      if (tableExists.length > 0) {
        // Hiển thị cấu trúc table
        const columns = await prisma.$queryRaw`
          SELECT column_name, data_type, is_nullable 
          FROM information_schema.columns 
          WHERE table_name = 'exercise_comments'
          ORDER BY ordinal_position;
        `;
        console.log('\n📋 Cấu trúc columns:');
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
        });
      }
    } else {
      console.log('\n📝 Danh sách tất cả bình luận:\n');
      
      // Lấy tất cả comments với thông tin author
      const comments = await prisma.exercise_comments.findMany({
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            }
          },
          exercise_comment_likes: true,
          other_exercise_comments: true, // replies
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      comments.forEach((comment, index) => {
        console.log(`${index + 1}. 💬 Comment ID: ${comment.id}`);
        console.log(`   📁 Exercise: ${comment.exerciseId}`);
        console.log(`   🔗 URL: ${comment.exerciseUrl || 'N/A'}`);
        console.log(`   👤 Author: ${comment.users.name} (${comment.users.role})`);
        console.log(`   💭 Content: "${comment.content.substring(0, 100)}${comment.content.length > 100 ? '...' : ''}"`);
        console.log(`   ❤️  Likes: ${comment.likes}`);
        console.log(`   💬 Replies: ${comment.other_exercise_comments.length}`);
        console.log(`   🕐 Created: ${comment.createdAt.toLocaleDateString('vi-VN')}`);
        console.log(`   ${comment.published ? '✅ Published' : '❌ Not published'}`);
        console.log('   ' + '─'.repeat(50));
      });
      
      // Thống kê theo exercise
      console.log('\n📊 Thống kê theo bài tập:');
      const exerciseStats = await prisma.exercise_comments.groupBy({
        by: ['exerciseId'],
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      });
      
      exerciseStats.forEach((stat, index) => {
        console.log(`${index + 1}. ${stat.exerciseId}: ${stat._count.id} bình luận`);
      });
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra comments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkComments();
