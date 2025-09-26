import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, ChevronRight, Clock, Users, CheckCircle } from "lucide-react"

export default function AdjektivendungenIndexPage() {
  const exercises = [
    {
      id: "teil1",
      title: "Teil 1: Nach bestimmtem Artikel",
      description: "Luyện tập điền đuôi tính từ sau mạo từ xác định (der, die, das)",
      difficulty: "Cơ bản",
      exercises: 40,
      type: "Điền từ",
      href: "/a2niveau/Übungen/adjektivendungen/teil1",
      topics: ["der/die/das + Adjektiv", "Deklination", "Alle Kasus"],
      estimatedTime: "15 phút"
    },
    {
      id: "teil2", 
      title: "Teil 2: Nach unbestimmtem Artikel",
      description: "Luyện tập điền đuôi tính từ sau mạo từ không xác định (ein, eine, einen)", 
      difficulty: "Cơ bản",
      exercises: 40,
      type: "Điền từ",
      href: "/a2niveau/Übungen/adjektivendungen/teil2",
      topics: ["ein/eine + Adjektiv", "Gemischte Deklination", "Alle Kasus"],
      estimatedTime: "15 phút"
    },
    {
      id: "teil3",
      title: "Teil 3: Nach Nullartikel", 
      description: "Luyện tập điền đuôi tính từ khi không có mạo từ (Nullartikel)",
      difficulty: "Trung bình",
      exercises: 40, 
      type: "Điền từ",
      href: "/a2niveau/Übungen/adjektivendungen/teil3",
      topics: ["Keine Artikel", "Starke Deklination", "Plural"],
      estimatedTime: "20 phút"
    },
    {
      id: "teil4",
      title: "Teil 4: Gemischte Übungen",
      description: "Bài tập tổng hợp tất cả các trường hợp đuôi tính từ",
      difficulty: "Khó", 
      exercises: 50,
      type: "Tổng hợp",
      href: "/a2niveau/Übungen/adjektivendungen/teil4",
      topics: ["Alle Artikel", "Gemischte Kasus", "Complex Sentences"],
      estimatedTime: "25 phút"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Cơ bản": return "bg-green-100 text-green-800";
      case "Trung bình": return "bg-yellow-100 text-yellow-800";
      case "Khó": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Adjektivendungen</h1>
            <p className="text-gray-600">Đuôi tính từ - Một trong những chủ đề khó nhất của ngữ pháp tiếng Đức</p>
          </div>
        </div>
        
        {/* Overview Stats */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span><strong>4 bài tập</strong> từ cơ bản đến nâng cao</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />  
                <span><strong>170 câu hỏi</strong> tổng cộng</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span><strong>75 phút</strong> ước tính</span>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">A2 Level</Badge>
          </div>
        </div>
      </div>

      {/* Grammar Theory Box */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
        <h3 className="font-semibold text-amber-800 mb-2">💡 Nhắc lại lý thuyết</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>Adjektivendungen</strong> phụ thuộc vào 3 yếu tố:</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <strong>1. Loại mạo từ:</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                <li>Bestimmt: der/die/das</li>
                <li>Unbestimmt: ein/eine</li> 
                <li>Nullartikel: không mạo từ</li>
              </ul>
            </div>
            <div>
              <strong>2. Kasus (Cách):</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                <li>Nominativ (Chủ cách)</li>
                <li>Akkusativ (Bổ ngữ trực tiếp)</li>
                <li>Dativ (Bổ ngữ gián tiếp)</li>
              </ul>
            </div>
            <div>
              <strong>3. Giống của danh từ:</strong>
              <ul className="list-disc list-inside text-xs mt-1">
                <li>Maskulin (der)</li>
                <li>Feminin (die)</li>
                <li>Neutrum (das)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Danh sách bài tập</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {exercises.map((exercise, index) => (
            <Card key={exercise.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        {index + 1}/4
                      </span>
                      <Badge className={getDifficultyColor(exercise.difficulty)}>
                        {exercise.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mt-2">
                      {exercise.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {exercise.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Topics */}
                <div>
                  <div className="text-xs font-medium text-gray-700 mb-1">Nội dung:</div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.topics.map((topic, topicIndex) => (
                      <span key={topicIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{exercise.exercises} câu</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{exercise.estimatedTime}</span>
                  </div>
                </div>
                
                {/* Action Button */}
                <Link href={exercise.href}>
                  <div className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                    <span className="font-medium">Bắt đầu bài tập</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">🎯 Chiến lược học tập</h3>
        <div className="text-sm text-green-700 grid md:grid-cols-2 gap-4">
          <div>
            <strong>Trước khi bắt đầu:</strong>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>Ôn lại bảng chia đuôi tính từ</li>
              <li>Nhớ kỹ giống của các danh từ phổ biến</li>
              <li>Phân biệt được 4 Kasus cơ bản</li>
            </ul>
          </div>
          <div>
            <strong>Khi làm bài:</strong>
            <ul className="list-disc list-inside text-xs mt-1 space-y-1">
              <li>Xác định: Artikel → Kasus → Gender</li>
              <li>Áp dụng quy tắc từng bước</li>
              <li>Kiểm tra lại đáp án cẩn thận</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Link href="/a2niveau/Übungen" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1">
          <span>← Quay lại A2 Übungen</span>
        </Link>
        <Link href="/a2niveau/grammatik/02-adjektivdeklination" className="text-gray-500 hover:text-gray-700 transition-colors">
          📚 Ôn lý thuyết Adjektivdeklination
        </Link>
        <Link href="/a2niveau/Übungen/steigerung" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center space-x-1">
          <span>Steigerung →</span>
        </Link>
      </div>
    </div>
  )
}
