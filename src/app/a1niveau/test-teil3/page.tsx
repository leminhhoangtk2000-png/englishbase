import { FormingQuestionsSimple } from '@/components/exercises/forming-questions-simple';
import { teil3ExerciseData } from '@/data/teil3-exercises';

export default function Teil3SimplePage() {
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

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>Bài tập được thiết kế để giúp bạn thành thạo việc tạo câu hỏi W-Fragen.</p>
          <p className="mt-2">Hãy chú ý đến từ để hỏi phù hợp: Wo?, Was?, Wer?, Wann?, Wie?, Wohin?, Woher?, Mit wem?, Welche?</p>
        </div>
      </div>
    </div>
  );
}
