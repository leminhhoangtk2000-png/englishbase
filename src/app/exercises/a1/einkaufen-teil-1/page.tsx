import EinkaufenTeil1 from '@/content/exercises/a1/einkaufen-teil-1.mdx';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <main className="container mx-auto max-w-5xl py-8 px-4">
        {/* Header Section */}
        <div className="mb-8">
          <nav className="mb-6 flex items-center space-x-2 text-sm text-muted-foreground">
            <a href="/exercises" className="hover:text-purple-600 transition-colors font-medium">
              🎓 Bài tập
            </a>
            <span className="text-purple-300">→</span>
            <a href="/exercises/a1" className="hover:text-purple-600 transition-colors font-medium">
              A1
            </a>
            <span className="text-purple-300">→</span>
            <div className="text-purple-700 font-semibold">Einkaufen Teil 1</div>
          </nav>
          
          {/* Exercise Title Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 mb-8">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Trình độ A1
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3 font-headline">
                🛍️ Einkaufen Teil 1
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Học cách mua sắm bằng tiếng Đức thông qua các tình huống thực tế trong siêu thị, chợ và cửa hàng thời trang.
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <article className="prose prose-lg prose-stone dark:prose-invert max-w-none 
                          prose-headings:font-headline prose-headings:text-gray-900
                          prose-h2:text-2xl prose-h2:font-bold prose-h2:mb-6 prose-h2:mt-12
                          prose-h3:text-xl prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-8
                          prose-p:leading-7 prose-p:text-gray-700
                          prose-a:text-purple-600 hover:prose-a:text-purple-800 prose-a:no-underline hover:prose-a:underline
                          prose-li:my-1 prose-strong:text-gray-900">
          <EinkaufenTeil1 />
        </article>
      </main>
    </div>
  );
}
