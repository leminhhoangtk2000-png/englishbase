import { ExerciseTable } from '@/components/exercises/exercise-table';
import { teil1ArtikelData } from '@/data/teil1-artikel-exercises';

export default function Teil1ArtikelPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">{teil1ArtikelData.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">
            {teil1ArtikelData.description}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 font-medium">
              📝 <strong>Hướng dẫn:</strong> Điền vào chỗ trống <code>__</code> với mạo từ đúng (der, die, das) và chia động từ trong ngoặc theo thì hiện tại.
            </p>
          </div>
        </div>

        {/* Grammar Tips */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-semibold mb-4 text-amber-800">💡 Mẹo nhớ mạo từ:</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">der (Maskulin)</h4>
              <ul className="text-blue-600 space-y-1">
                <li>• der Tisch (bàn)</li>
                <li>• der Hund (chó)</li>
                <li>• der Mann (đàn ông)</li>
                <li>• der Vater (bố)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-pink-700 mb-2">die (Feminin)</h4>
              <ul className="text-pink-600 space-y-1">
                <li>• die Blume (hoa)</li>
                <li>• die Lampe (đèn)</li>
                <li>• die Frau (phụ nữ)</li>
                <li>• die Mutter (mẹ)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-green-700 mb-2">das (Neutrum)</h4>
              <ul className="text-green-600 space-y-1">
                <li>• das Auto (xe hơi)</li>
                <li>• das Kind (trẻ em)</li>
                <li>• das Buch (sách)</li>
                <li>• das Haus (nhà)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exercise Sections */}
        <div className="space-y-12">
          {teil1ArtikelData.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl font-semibold mb-6 text-center">
                {section.title}
              </h2>
              <ExerciseTable
                title={section.title}
                subtitle={section.subtitle}
                exercises={section.exercises}
              />
            </div>
          ))}
        </div>

        {/* Verb Conjugation Help */}
        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-center">Chia động từ thường gặp</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Động từ quy tắc:</h4>
              <ul className="space-y-1">
                <li><strong>spielen:</strong> spielt</li>
                <li><strong>stehen:</strong> steht</li>
                <li><strong>liegen:</strong> liegt</li>
                <li><strong>gehören:</strong> gehört</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Động từ bất quy tắc:</h4>
              <ul className="space-y-1">
                <li><strong>sein:</strong> ist</li>
                <li><strong>haben:</strong> hat</li>
                <li><strong>fahren:</strong> fährt</li>
                <li><strong>laufen:</strong> läuft</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Động từ mạnh:</h4>
              <ul className="space-y-1">
                <li><strong>lesen:</strong> liest</li>
                <li><strong>nehmen:</strong> nimmt</li>
                <li><strong>schlafen:</strong> schläft</li>
                <li><strong>sprechen:</strong> spricht</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Bài tập giúp bạn luyện tập sử dụng mạo từ và chia động từ trong tiếng Đức</p>
        </div>
      </div>
    </div>
  );
}
