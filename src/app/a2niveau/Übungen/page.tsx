import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, Lightbulb, ChevronRight, Star, Clock, Users } from "lucide-react"

export default function A2UebungenIndexPage() {
  const exerciseCategories = [
    {
      id: "adjektivendungen",
      title: "Adjektivendungen",
      description: "Bài tập về đuôi tính từ sau các mạo từ khác nhau",
      difficulty: "Trung bình",
      exercises: 4,
      totalQuestions: "40+ câu",
      type: "Điền từ",
      href: "/a2niveau/Übungen/adjektivendungen",
      color: "bg-blue-500",
      topics: ["Bestimmter Artikel", "Unbestimmter Artikel", "Nullartikel", "Gemischte Übungen"]
    },
    {
      id: "steigerung",
      title: "Steigerung", 
      description: "Bài tập về so sánh (Komparativ và Superlativ)",
      difficulty: "Trung bình",
      exercises: 3,
      totalQuestions: "30+ câu", 
      type: "Trắc nghiệm",
      href: "/a2niveau/Übungen/steigerung",
      color: "bg-green-500",
      topics: ["So sánh bằng", "So sánh hơn", "So sánh nhất"]
    },
    {
      id: "perfekt-prateritum",
      title: "Perfekt & Präteritum",
      description: "Bài tập về thì quá khứ Perfekt và Präteritum", 
      difficulty: "Khó",
      exercises: 5,
      totalQuestions: "50+ câu",
      type: "Chia động từ",
      href: "/a2niveau/Übungen/perfekt-prateritum",
      color: "bg-purple-500",
      topics: ["Perfekt Grundlagen", "Präteritum Formen", "Phân biệt 2 thì", "Irregular Verbs", "Advanced"]
    },
    {
      id: "plusquamperfekt",
      title: "Plusquamperfekt",
      description: "Bài tập về thì quá khứ hoàn thành Plusquamperfekt",
      difficulty: "Khó", 
      exercises: 3,
      totalQuestions: "30+ câu",
      type: "Chia động từ",
      href: "/a2niveau/Übungen/plusquamperfekt", 
      color: "bg-red-500",
      topics: ["Grundlagen", "Mit haben und sein", "Erweiterte Übungen"]
    },
    {
      id: "nebensatze",
      title: "Nebensätze",
      description: "Bài tập về mệnh đề phụ và liên từ",
      difficulty: "Rất khó",
      exercises: 7,
      totalQuestions: "70+ câu", 
      type: "Nối câu",
      href: "/a2niveau/Übungen/nebensatze",
      color: "bg-indigo-500",
      topics: ["Temporal", "Kausal", "Konditional", "Relativ", "Final", "Modal", "Gemischt"]
    },
    {
      id: "passiv",
      title: "Passiv",
      description: "Bài tập về thể bị động (Passiv)",
      difficulty: "Khó",
      exercises: 4,
      totalQuestions: "40+ câu",
      type: "Chuyển đổi câu", 
      href: "/a2niveau/Übungen/passiv",
      color: "bg-yellow-500",
      topics: ["Präsens Passiv", "Präteritum Passiv", "Perfekt Passiv", "Modalverben Passiv"]
    },
    {
      id: "futur", 
      title: "Futur I & II",
      description: "Bài tập về thì tương lai Futur I và Futur II",
      difficulty: "Trung bình",
      exercises: 2,
      totalQuestions: "20+ câu",
      type: "Chia động từ",
      href: "/a2niveau/Übungen/futur",
      color: "bg-cyan-500", 
      topics: ["Futur I", "Futur II"]
    },
    {
      id: "possessivpronomen",
      title: "Possessivpronomen", 
      description: "Bài tập về đại từ sở hữu",
      difficulty: "Trung bình",
      exercises: 2,
      totalQuestions: "20+ câu",
      type: "Điền từ",
      href: "/a2niveau/Übungen/possessivpronomen",
      color: "bg-pink-500",
      topics: ["Grundformen", "Deklination"] 
    },
    {
      id: "reflexivpronomen",
      title: "Reflexivpronomen",
      description: "Bài tập về đại từ phản thân",
      difficulty: "Khó", 
      exercises: 5,
      totalQuestions: "50+ câu",
      type: "Điền từ",
      href: "/a2niveau/Übungen/reflexivpronomen",
      color: "bg-orange-500",
      topics: ["Reflexive Verben", "Akkusativ vs Dativ", "Reziproke", "Gemischt", "Advanced"]
    },
    {
      id: "genitiv",
      title: "Genitiv", 
      description: "Bài tập về cách Genitiv (sở hữu cách)",
      difficulty: "Rất khó",
      exercises: 3,
      totalQuestions: "30+ câu", 
      type: "Điền từ",
      href: "/a2niveau/Übungen/genitiv",
      color: "bg-teal-500",
      topics: ["Grundlagen", "Präpositionen", "Attribute"]
    }
  ];

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      "Trung bình": "bg-yellow-100 text-yellow-800",
      "Khó": "bg-orange-100 text-orange-800", 
      "Rất khó": "bg-red-100 text-red-800"
    };
    return colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Target className="h-8 w-8 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">A2 Übungen</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Bài tập ngữ pháp tiếng Đức cấp độ A2 - Nâng cao từ A1 với 10 chủ đề chính và hơn 350 câu hỏi
        </p>
        
        {/* Stats */}
        <div className="flex justify-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>10 chủ đề</span>
          </div>
          <div className="flex items-center space-x-1">  
            <Users className="h-4 w-4" />
            <span>37 bài tập</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" /> 
            <span>350+ câu hỏi</span>
          </div>
        </div>
      </div>

      {/* Exercise Categories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {exerciseCategories.map((category) => (
          <Card key={category.id} className="group hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className={`${category.color} w-4 h-12 rounded mr-3`}></div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getDifficultyBadge(category.difficulty)}>
                  {category.difficulty}
                </Badge>
                <Badge variant="outline">{category.type}</Badge>
              </div>
              
              {/* Stats */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>{category.exercises} bài tập</span>
                <span>{category.totalQuestions}</span>
              </div>
              
              {/* Topics Preview */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-700">Chủ đề:</div>
                <div className="flex flex-wrap gap-1">
                  {category.topics.slice(0, 3).map((topic, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {topic}
                    </span>
                  ))}
                  {category.topics.length > 3 && (
                    <span className="text-xs text-gray-500">+{category.topics.length - 3} more</span>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <Link href={category.href}>
                <div className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                  <span className="font-medium">Bắt đầu luyện tập</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning Path */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mt-8">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-900">Lộ trình học tập A2</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🎯 Bắt đầu với (Dễ → Khó):</h3>
            <ol className="space-y-1 text-gray-600 list-decimal list-inside">
              <li>Adjektivendungen - Làm quen với A2</li>
              <li>Steigerung - Củng cố so sánh</li>
              <li>Futur I & II - Thì tương lai đơn giản</li>
              <li>Possessivpronomen - Đại từ sở hữu</li>
              <li>Perfekt & Präteritum - Thì quan trọng</li>
            </ol>
          </div>
          <div>
            <h3 className="font-medium text-gray-900 mb-2">🔥 Thử thách nâng cao:</h3>
            <ol className="space-y-1 text-gray-600 list-decimal list-inside">
              <li>Passiv - Thể bị động phức tạp</li>
              <li>Reflexivpronomen - Đại từ phản thân</li>
              <li>Plusquamperfekt - Thì khó nhất</li>
              <li>Nebensätze - Mệnh đề phụ (Quan trọng nhất)</li>
              <li>Genitiv - Cách khó nhất tiếng Đức</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border-t pt-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/a2niveau/grammatik" className="text-blue-600 hover:text-blue-800 transition-colors">
            📚 A2 Grammatik
          </Link>
          <Link href="/a2niveau/vokabular" className="text-blue-600 hover:text-blue-800 transition-colors">
            📖 A2 Vokabular  
          </Link>
          <Link href="/a1niveau/Übungen" className="text-gray-500 hover:text-gray-700 transition-colors">
            ⬅️ Quay lại A1 Übungen
          </Link>
          <Link href="/b1niveau/Übungen" className="text-gray-500 hover:text-gray-700 transition-colors">
            ➡️ Tiến lên B1 Übungen
          </Link>
        </div>
      </div>
    </div>
  )
}
