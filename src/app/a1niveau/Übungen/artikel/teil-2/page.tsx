import Lueckentext from "@/components/exercises/Lueckentext"
import { teil2ArtikelData } from "@/data/teil2-artikel-exercises"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Target, Lightbulb } from "lucide-react"

export default function ArtikelTeil2Page() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-primary">
          {teil2ArtikelData.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {teil2ArtikelData.description}
        </p>
        <div className="flex justify-center">
          <Badge variant="outline" className="flex items-center gap-2">
            <BookOpen size={16} />
            Niveau: A1
          </Badge>
        </div>
      </div>

      {/* Grammar Tips */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Lightbulb size={20} />
            Ngữ pháp cần nhớ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Mạo từ xác định (der, die, das):
            </h4>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li><strong>der</strong> - danh từ giống đực (Maskulinum): der Mann, der Tisch</li>
              <li><strong>die</strong> - danh từ giống cái (Femininum): die Frau, die Lampe</li>
              <li><strong>das</strong> - danh từ trung tính (Neutrum): das Kind, das Haus</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Chia động từ thì hiện tại (Präsens):
            </h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Động từ thường:</p>
                <ul className="list-disc pl-4">
                  <li>ich spiel<strong>e</strong>, du spiel<strong>st</strong></li>
                  <li>er/sie/es spiel<strong>t</strong></li>
                  <li>wir/sie/Sie spiel<strong>en</strong></li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Động từ bất quy tắc:</p>
                <ul className="list-disc pl-4">
                  <li>haben: ich hab<strong>e</strong>, du ha<strong>st</strong>, er ha<strong>t</strong></li>
                  <li>sein: ich bin, du bist, er ist</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Instruction */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <Target size={20} />
            Hướng dẫn làm bài
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 dark:text-green-400">1.</span>
              Đọc kỹ đoạn văn và hiểu nội dung
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 dark:text-green-400">2.</span>
              Điền từ thích hợp vào chỗ trống (mạo từ hoặc động từ đã chia)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 dark:text-green-400">3.</span>
              Chú ý giới tính của danh từ khi chọn mạo từ
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-green-600 dark:text-green-400">4.</span>
              Chia động từ đúng theo chủ ngữ
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Vocabulary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} />
            Từ vựng sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {teil2ArtikelData.vocabulary.map((word, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {word}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Sections */}
      <div className="space-y-8">
        {teil2ArtikelData.sections.map((section, index) => (
          <Card key={index} className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary">
                {section.title}
              </CardTitle>
              <p className="text-muted-foreground">{section.description}</p>
            </CardHeader>
            <CardContent>
              <Lueckentext
                textParts={section.textParts}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Tips */}
      <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-700 dark:text-amber-300">
            💡 Mẹo học tập
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>• Học thuộc giới tính của danh từ cùng với từ vựng</p>
          <p>• Luyện tập chia động từ thường xuyên</p>
          <p>• Đọc to để quen với âm điệu câu</p>
          <p>• Dịch nghĩa để hiểu nội dung sâu hơn</p>
        </CardContent>
      </Card>
    </div>
  )
}
