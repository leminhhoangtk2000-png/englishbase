import { FormingQuestionsSimple } from '@/components/exercises/forming-questions-simple';
import { teil3ExerciseData } from '@/data/teil3-exercises';

export default function Teil3Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{teil3ExerciseData.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Luyện tập chuyển câu khẳng định thành câu hỏi W-Fragen trong tiếng Đức
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-amber-800 font-medium">
              💡 <strong>Mẹo:</strong> Phần được <mark className="bg-yellow-200 px-1 rounded">highlight màu vàng</mark> trong câu là phần bạn cần đặt câu hỏi cho!
            </p>
          </div>
        </div>

        {/* Exercise Sections */}
        <div className="space-y-12">
          {teil3ExerciseData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {section.title}
              </h2>
              <FormingQuestionsSimple
                title={section.title}
                exercises={section.exercises}
              />
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Hướng dẫn tổng quát</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Các từ để hỏi phổ biến:</h4>
              <ul className="text-left space-y-1">
                <li><strong>Wo?</strong> - Ở đâu</li>
                <li><strong>Was?</strong> - Gì/Cái gì</li>
                <li><strong>Wer?</strong> - Ai</li>
                <li><strong>Wann?</strong> - Khi nào</li>
                <li><strong>Wie?</strong> - Như thế nào</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Từ để hỏi nâng cao:</h4>
              <ul className="text-left space-y-1">
                <li><strong>Wohin?</strong> - Đi đâu</li>
                <li><strong>Woher?</strong> - Từ đâu</li>
                <li><strong>Mit wem?</strong> - Với ai</li>
                <li><strong>Welche?</strong> - Cái nào</li>
                <li><strong>Wem?</strong> - Cho ai (Dativ)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Author Credit */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Bài tập được thiết kế bởi <strong>Lonia</strong></p>
        </div>
      </div>
    </div>
  );
}
