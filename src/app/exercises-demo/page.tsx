import React from 'react'
import { 
  Lueckentext, 
  MultipleChoice, 
  MatchingExercise, 
  WritingExercise, 
  AuthorCredit, 
  FacebookComments,
  GrammarBox,
  VocabularyList
} from '@/components/exercises'
import CommentSystem from '@/components/exercises/CommentSystem'

export default function ExercisesDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Demo Exercise Components</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Đây là trang demo các components bài tập cho hệ thống học tiếng Đức.
          </p>

        {/* 1. Lueckentext */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">1. Bài tập điền chỗ trống (Lueckentext)</h2>
          <Lueckentext
            title="Bài tập: Điền mạo từ (der, die, das)"
            textParts={[
              "1. ", { type: "blank", correctAnswer: "Der" }, " Tisch (sein) ", { type: "blank", correctAnswer: "ist" }, " groß.", "\n",
              "2. ", { type: "blank", correctAnswer: "Die" }, " Blume (haben) ", { type: "blank", correctAnswer: "hat" }, " eine schöne Farbe.", "\n",
              "3. ", { type: "blank", correctAnswer: "Das" }, " Auto (fahren) ", { type: "blank", correctAnswer: "fährt" }, " sehr schnell.", "\n",
              "4. ", { type: "blank", correctAnswer: "Das" }, " Kind (spielen) ", { type: "blank", correctAnswer: "spielt" }, " im Garten."
            ]}
          />
        </section>

        {/* 2. Multiple Choice */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">2. Bài tập trắc nghiệm (Multiple Choice)</h2>
          <MultipleChoice
            title="Bài tập: Chọn mạo từ đúng"
            questions={[
              {
                question: "_____ Hund ist sehr freundlich.",
                options: [
                  { text: "Der", isCorrect: true, explanation: "Hund là danh từ giống đực nên dùng 'der'" },
                  { text: "Die", isCorrect: false },
                  { text: "Das", isCorrect: false }
                ]
              },
              {
                question: "_____ Katze schläft auf dem Sofa.",
                options: [
                  { text: "Der", isCorrect: false },
                  { text: "Die", isCorrect: true, explanation: "Katze là danh từ giống cái nên dùng 'die'" },
                  { text: "Das", isCorrect: false }
                ]
              },
              {
                question: "_____ Auto fährt sehr schnell.",
                options: [
                  { text: "Der", isCorrect: false },
                  { text: "Die", isCorrect: false },
                  { text: "Das", isCorrect: true, explanation: "Auto là danh từ giống trung nên dùng 'das'" }
                ]
              }
            ]}
          />
        </section>

        {/* 3. Matching Exercise */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">3. Bài tập ghép cặp (Matching Exercise)</h2>
          <MatchingExercise
            title="Bài tập: Ghép từ Đức - Việt"
            leftColumnTitle="Tiếng Đức"
            rightColumnTitle="Tiếng Việt"
            items={[
              { id: "1", left: "der Hund", right: "con chó", explanation: "Động vật nuôi phổ biến" },
              { id: "2", left: "die Katze", right: "con mèo", explanation: "Động vật nuôi trong nhà" },
              { id: "3", left: "das Haus", right: "ngôi nhà", explanation: "Nơi ở của con người" },
              { id: "4", left: "der Tisch", right: "cái bàn", explanation: "Đồ nội thất" },
              { id: "5", left: "die Blume", right: "bông hoa", explanation: "Thực vật có màu sắc" }
            ]}
          />
        </section>

        {/* 4. Writing Exercise */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">4. Bài tập viết (Writing Exercise)</h2>
          <WritingExercise
            title="Bài tập: Viết đoạn văn về gia đình"
            prompt={{
              question: "Hãy viết một đoạn văn ngắn giới thiệu về gia đình bạn bằng tiếng Đức.",
              minWords: 50,
              maxWords: 100,
              keywords: ["Familie", "Vater", "Mutter", "wohnen", "arbeiten"],
              hints: [
                "Bắt đầu với 'Meine Familie...'",
                "Giới thiệu từng thành viên trong gia đình",
                "Nói về nghề nghiệp và sở thích",
                "Kết thúc với cảm nhận về gia đình"
              ],
              sampleAnswer: "Meine Familie ist sehr wichtig für mich. Mein Vater arbeitet als Ingenieur und meine Mutter ist Lehrerin. Wir wohnen in einem kleinen Haus in der Stadt. Am Wochenende verbringen wir gerne Zeit zusammen. Wir kochen gemeinsam und schauen Filme. Ich liebe meine Familie sehr."
            }}
          />
        </section>

        {/* 5. Grammar Box */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">5. Hộp ngữ pháp (Grammar Box)</h2>
          <GrammarBox
            title="Mạo từ (der, die, das)"
            level="A1"
            rules={[
              {
                rule: "Danh từ giống đực dùng 'der'",
                explanation: "Các danh từ giống đực trong tiếng Đức sử dụng mạo từ 'der'.",
                examples: [
                  "der Mann (người đàn ông)",
                  "der Tisch (cái bàn)",
                  "der Hund (con chó)"
                ]
              },
              {
                rule: "Danh từ giống cái dùng 'die'",
                explanation: "Các danh từ giống cái trong tiếng Đức sử dụng mạo từ 'die'.",
                examples: [
                  "die Frau (người phụ nữ)",
                  "die Katze (con mèo)",
                  "die Blume (bông hoa)"
                ]
              },
              {
                rule: "Danh từ giống trung dùng 'das'",
                explanation: "Các danh từ giống trung trong tiếng Đức sử dụng mạo từ 'das'.",
                examples: [
                  "das Kind (đứa trẻ)",
                  "das Haus (ngôi nhà)",
                  "das Auto (ô tô)"
                ]
              }
            ]}
            tips={[
              "Học từ vựng luôn cùng với mạo từ",
              "Tạo flashcard với màu sắc khác nhau cho từng giống",
              "Luyện tập thường xuyên để ghi nhớ tốt hơn"
            ]}
            exceptions={[
              "das Mädchen (cô gái) - mặc dù là nữ nhưng dùng 'das'",
              "die Person (người) - luôn dùng 'die' dù là nam hay nữ"
            ]}
          />
        </section>

        {/* 6. Vocabulary List */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">6. Danh sách từ vựng (Vocabulary List)</h2>
          <VocabularyList
            title="Từ vựng A1: Gia đình & Động vật"
            words={[
              {
                german: "der Vater",
                vietnamese: "người cha",
                pronunciation: "ˈfaːtɐ",
                example: "Mein Vater arbeitet im Büro.",
                exampleTranslation: "Cha tôi làm việc ở văn phòng.",
                category: "Gia đình",
                level: "A1"
              },
              {
                german: "die Mutter",
                vietnamese: "người mẹ",
                pronunciation: "ˈmʊtɐ",
                example: "Meine Mutter kocht sehr gut.",
                exampleTranslation: "Mẹ tôi nấu ăn rất ngon.",
                category: "Gia đình",
                level: "A1"
              },
              {
                german: "das Kind",
                vietnamese: "đứa trẻ",
                pronunciation: "kɪnt",
                example: "Das Kind spielt im Garten.",
                exampleTranslation: "Đứa trẻ chơi trong vườn.",
                category: "Gia đình",
                level: "A1"
              },
              {
                german: "der Hund",
                vietnamese: "con chó",
                pronunciation: "hʊnt",
                example: "Der Hund ist sehr freundlich.",
                exampleTranslation: "Con chó rất thân thiện.",
                category: "Động vật",
                level: "A1"
              },
              {
                german: "die Katze",
                vietnamese: "con mèo",
                pronunciation: "ˈkatsə",
                example: "Die Katze schläft auf dem Sofa.",
                exampleTranslation: "Con mèo ngủ trên ghế sofa.",
                category: "Động vật",
                level: "A1"
              },
              {
                german: "der Bruder",
                vietnamese: "anh/em trai",
                pronunciation: "ˈbruːdɐ",
                example: "Mein Bruder ist 15 Jahre alt.",
                exampleTranslation: "Anh trai tôi 15 tuổi.",
                category: "Gia đình",
                level: "A1"
              }
            ]}
            showCategories={true}
          />
        </section>

        {/* 7. Author Credit */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">7. Thông tin tác giả (Author Credit)</h2>
          <AuthorCredit 
            author="Lonia" 
            role="Giáo viên tiếng Đức"
            date="30/08/2025"
            bio="Chuyên gia giảng dạy tiếng Đức với 5 năm kinh nghiệm"
          />
        </section>

        {/* 8. Comments Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">8. Hỏi đáp & Thảo luận (Comments)</h2>
          
          {/* Admonition manually created */}
          <div className="admonition admonition-tip mb-6">
            <div className="admonition-title">VITAMIN ĐỘNG LỰC 🌱</div>
            <div className="admonition-content">
              Nếu bạn thấy việc mình đang làm có ý nghĩa, hãy để lại một lời động viên nhé 😊
            </div>
          </div>

          <FacebookComments 
            url="https://edu-theme.com/demo/exercise-components"
            initialComments={[
              {
                id: "1",
                author: "Học viên A",
                content: "Bài tập rất hay và dễ hiểu. Cảm ơn thầy cô!",
                timestamp: "29/08/2025",
                likes: 3,
                replies: [
                  {
                    id: "1-1",
                    author: "Lonia",
                    content: "Cảm ơn bạn! Chúc bạn học tốt!",
                    timestamp: "29/08/2025",
                    likes: 1
                  }
                ]
              },
              {
                id: "2",
                author: "Học viên B",
                content: "Các bài tập ghép cặp rất thú vị. Tôi đã làm được 100% đúng!",
                timestamp: "30/08/2025",
                likes: 2
              }
            ]}
          />
        </section>

        {/* Tips */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">9. Hướng dẫn sử dụng</h2>
          
          <div className="space-y-4">
            <div className="admonition admonition-note">
              <div className="admonition-title">LƯU Ý</div>
              <div className="admonition-content">
                Tất cả các components đã được thiết kế responsive và hỗ trợ dark mode.
              </div>
            </div>

            <div className="admonition admonition-tip">
              <div className="admonition-title">MẸO HAY</div>
              <div className="admonition-content">
                Sử dụng các components này trong file MDX bằng cách import và sử dụng như JSX components.
              </div>
            </div>

            <div className="admonition admonition-important">
              <div className="admonition-title">QUAN TRỌNG</div>
              <div className="admonition-content">
                Đảm bảo tất cả data truyền vào components đều có đúng type để tránh lỗi.
              </div>
            </div>

            <div className="admonition admonition-warning">
              <div className="admonition-title">CẢNH BÁO</div>
              <div className="admonition-content">
                Kiểm tra kỹ dữ liệu đáp án trước khi publish bài tập.
              </div>
            </div>

            <div className="admonition admonition-caution">
              <div className="admonition-title">THẬN TRỌNG</div>
              <div className="admonition-content">
                Backup dữ liệu bài tập thường xuyên để tránh mất mát.
              </div>
            </div>

            <div className="admonition admonition-danger">
              <div className="admonition-title">NGUY HIỂM</div>
              <div className="admonition-content">
                Không chỉnh sửa trực tiếp các file component mà không backup trước.
              </div>
            </div>
          </div>
        </section>

        {/* 8. Comment System */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">8. Comment System</h2>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <CommentSystem 
              exerciseId="exercises-demo-123"
            />
          </div>
        </section>
      </div>
    </div>
    </div>
  )
}
