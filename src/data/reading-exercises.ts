import { ReadingExercise } from '@/types/reading-exercise';

// Mock reading exercises data for different articles
export const mockReadingExercises: Record<string, ReadingExercise> = {
  '1': {
    id: 'ex-1',
    title: 'Bài tập đọc hiểu: Chính sách năng lượng Đức',
    articleId: '1',
    description: 'Kiểm tra hiểu biết của bạn về chính sách năng lượng mới của Đức thông qua các câu hỏi trắc nghiệm.',
    difficulty: 'B1',
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'Mục tiêu chính của chính sách năng lượng mới của Đức là gì?',
        options: [
          'Tăng sử dụng năng lượng hóa thạch',
          'Đạt 80% năng lượng tái tạo vào năm 2030',
          'Giảm chi phí điện cho người dân',
          'Xây dựng thêm nhà máy điện hạt nhân'
        ],
        correctAnswer: 'B',
        explanation: 'Theo bài báo, chính phủ Đức đặt mục tiêu đạt 80% năng lượng tái tạo vào năm 2030.'
      },
      {
        id: 'q2',
        type: 'true-false',
        question: 'Tổng vốn đầu tư cho chính sách năng lượng mới là 150 tỷ Euro trong 10 năm.',
        correctAnswer: 'true',
        explanation: 'Bài báo đề cập rõ ràng rằng tổng vốn đầu tư là 150 tỷ Euro trong 10 năm tới.'
      },
      {
        id: 'q3',
        type: 'multiple-choice',
        question: 'Ai là người phát biểu về tầm quan trọng của chính sách này?',
        options: [
          'Thủ tướng Đức',
          'Bộ trưởng Kinh tế Robert Habeck',
          'Chủ tịch EU',
          'Giám đốc một công ty năng lượng'
        ],
        correctAnswer: 'B',
        explanation: 'Bundeswirtschaftsminister Robert Habeck (Bộ trưởng Kinh tế Robert Habeck) đã có phát biểu quan trọng trong bài báo.'
      },
      {
        id: 'q4',
        type: 'true-false',
        question: 'Tất cả các doanh nghiệp năng lượng đều ủng hộ chính sách mới này.',
        correctAnswer: 'false',
        explanation: 'Bài báo đề cập rằng có sự phản đối từ các nhà cung cấp năng lượng nhỏ hơn về vấn đề tài chính.'
      }
    ]
  },

  '2': {
    id: 'ex-2',
    title: 'Bài tập đọc hiểu: Giáo dục số Đức',
    articleId: '2',
    description: 'Đánh giá khả năng hiểu về chương trình số hóa giáo dục tại các trường học Đức.',
    difficulty: 'A2',
    questions: [
      {
        id: 'q1',
        type: 'true-false',
        question: 'Chương trình số hóa sẽ trang bị tablet cho tất cả học sinh.',
        correctAnswer: 'true',
        explanation: 'Bài báo xác nhận rằng mỗi học sinh sẽ được trang bị tablet cá nhân.'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Môn học nào sẽ trở thành môn bắt buộc theo chương trình mới?',
        options: [
          'Toán học nâng cao',
          'Lập trình (Programmieren)',
          'Tiếng Anh',
          'Khoa học máy tính'
        ],
        correctAnswer: 'B',
        explanation: 'Programmieren (Lập trình) được đề cập như một môn học bắt buộc mới trong chương trình.'
      },
      {
        id: 'q3',
        type: 'true-false',
        question: 'Giáo viên sẽ được đào tạo sử dụng công nghệ số song song với việc trang bị thiết bị.',
        correctAnswer: 'true',
        explanation: 'Bài báo nhấn mạnh rằng việc đào tạo giáo viên diễn ra song song với việc trang bị thiết bị.'
      }
    ]
  }
};

// Function to get exercise by article ID
export function getExerciseByArticleId(articleId: string): ReadingExercise | null {
  return mockReadingExercises[articleId] || null;
}
