import CommentSystem from '@/components/exercises/CommentSystem'

export default function CommentsDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Demo: Hệ thống bình luận cho bài tập
        </h1>
        <p className="text-gray-600">
          Đây là demo component CommentSystem được thiết kế cho các trang bài tập tiếng Đức.
        </p>
      </div>

      {/* Sample Exercise Content */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Bài tập: Modal Verben</h2>
        <p className="text-gray-700 mb-4">
          Trong bài tập này, chúng ta sẽ học về các động từ modal trong tiếng Đức như können, müssen, wollen, sollen, dürfen, và mögen.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            💡 <strong>Mẹo:</strong> Modal verben luôn đi với động từ nguyên mẫu ở cuối câu.
          </p>
        </div>
      </div>

      {/* Comment System - Luôn mở */}
      <CommentSystem 
        exerciseId="modal-verben-exercise"
        currentUserId="user123"
        currentUserName="Khoavo Private"
        currentUserAvatar="/avatars/khoavo.jpg"
        showCommentsInitially={true}
      />

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Tính năng:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Hệ thống bình luận luôn mở sẵn</li>
          <li>• Comment lồng nhau (nested comments)</li>
          <li>• Nút 👍 thay vì ❤️</li>
          <li>• Đếm reply vào comment chính</li>
          <li>• Responsive design</li>
        </ul>
      </div>
    </div>
  )
}
