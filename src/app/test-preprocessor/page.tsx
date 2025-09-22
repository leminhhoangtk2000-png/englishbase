import { preprocessAdmonitions } from '@/lib/preprocess-admonitions'
import { markdownToHtml } from '@/lib/markdown'

export default async function TestPreprocessorPage() {
  // Test input
  const testMarkdown = `
# Test

:::note[Mẹo nhớ]
Danh từ nào **nhận lợi ích từ hành động** → đó là **Dativ**.
:::

:::tip[Tóm tắt All-in-One]
**Nhớ nhanh 3 Kasus:**

1. **_Nominativ_** = **Wer/Was?** → _Chủ ngữ_ làm gì đó
2. **_Akkusativ_** = **Wen/Was?** → _Tân ngữ_ bị tác động
3. **_Dativ_** = **Wem?** → _Ai_ nhận được lợi ích
:::

Normal content after.
`

  // Test preprocessor
  const preprocessed = preprocessAdmonitions(testMarkdown)
  
  // Test full pipeline
  const fullHtml = await markdownToHtml(testMarkdown)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Debug Preprocessor</h1>
      
      <h2>Original Markdown:</h2>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {testMarkdown}
      </pre>
      
      <h2>After Preprocessor:</h2>
      <pre className="bg-blue-100 p-4 rounded text-sm overflow-x-auto">
        {preprocessed}
      </pre>
      
      <h2>Final HTML:</h2>
      <pre className="bg-green-100 p-4 rounded text-sm overflow-x-auto">
        {fullHtml}
      </pre>
      
      <h2>Rendered Result:</h2>
      <div 
        className="prose prose-lg max-w-none border-2 border-gray-300 p-4 rounded"
        dangerouslySetInnerHTML={{ __html: fullHtml }}
      />
    </div>
  )
}
