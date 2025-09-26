import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, Lightbulb, ChevronRight } from "lucide-react"

export default function ArtikelIndexPage() {
  const exercises = [
    {
      id: "teil-1",
      title: "Teil 1: der, die, das in Präsens",
      description: "Luyện tập mạo từ cơ bản kết hợp với chia động từ thì hiện tại",
      difficulty: "Cơ bản",
      exercises: 30,
      type: "Trắc nghiệm",
      href: "/a1niveau/Übungen/artikel/teil-1"
    },
    {
      id: "teil-2", 
      title: "Teil 2: der, die, das in Präsens - Textübungen",
      description: "Luyện tập mạo từ và chia động từ qua bài điền từ vào chỗ trống", 
      difficulty: "Cơ bản",
      exercises: 15,
      type: "Điền từ",
      href: "/a1niveau/Übungen/artikel/teil-2"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">
          Artikel - Mạo từ xác định
        </h1>
        <p className="text-lg text-muted-foreground">
          Luyện tập mạo từ der, die, das trong tiếng Đức
        </p>
        <div className="flex justify-center">
          <Badge variant="outline" className="flex items-center gap-2">
            <BookOpen size={16} />
            Niveau: A1
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="text-sm text-muted-foreground">
        <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
        <span className="mx-2">/</span>
        <Link href="/a1niveau/Übungen" className="hover:text-foreground">Übungen</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">Artikel</span>
      </nav>

      {/* Grammar Overview */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Lightbulb size={20} />
            Kiến thức cần nhớ về Artikel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Mạo từ xác định (der, die, das):
            </h4>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-white dark:bg-gray-800 rounded">
                <p className="font-bold text-blue-600">der</p>
                <p>Danh từ giống đực (Maskulinum)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  der Mann, der Tisch, der Computer
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded">
                <p className="font-bold text-pink-600">die</p>
                <p>Danh từ giống cái (Femininum)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  die Frau, die Lampe, die Schule
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-gray-800 rounded">
                <p className="font-bold text-green-600">das</p>
                <p>Danh từ trung tính (Neutrum)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  das Kind, das Haus, das Bett
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Mẹo nhớ giới tính:
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>Danh từ chỉ nam giới thường dùng <strong>der</strong></li>
              <li>Danh từ chỉ nữ giới thường dùng <strong>die</strong></li>
              <li>Danh từ chỉ đồ vật nhỏ, trẻ em thường dùng <strong>das</strong></li>
              <li>Học từ vựng kèm mạo từ để nhớ lâu hơn</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Exercise List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Các bài tập</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {exercises.map((exercise) => (
            <Card key={exercise.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{exercise.title}</CardTitle>
                  <Badge variant="secondary">{exercise.difficulty}</Badge>
                </div>
                <p className="text-muted-foreground">{exercise.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>📝 {exercise.exercises} bài tập</span>
                  <span>🎯 {exercise.type}</span>
                </div>
                <Link 
                  href={exercise.href}
                  className="inline-flex items-center justify-center w-full rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Bắt đầu luyện tập
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-700 dark:text-amber-300">
            💡 Lời khuyên học tập
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Làm từ bài dễ đến bài khó để tạo nền tảng vững chắc</p>
          <p>• Học thuộc giới tính của danh từ cùng với từ vựng</p>
          <p>• Thực hành thường xuyên để ghi nhớ tốt hơn</p>
          <p>• Đọc to các câu để quen với âm điệu tiếng Đức</p>
        </CardContent>
      </Card>
    </div>
  )
}
