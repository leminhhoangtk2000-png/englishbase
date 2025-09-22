import { preprocessAdmonitions } from '@/lib/preprocess-admonitions'

export default function TestRegexPage() {
  // Test exact content from file
  const testContent = `:::note[Mẹo nhớ]
Danh từ nào **nhận lợi ích từ hành động** → đó là **Dativ**.
:::

:::tip[Tóm tắt All-in-One]
**Nhớ nhanh 3 Kasus:**

1. **_Nominativ_** = **Wer/Was?** → _Chủ ngữ_ làm gì đó
2. **_Akkusativ_** = **Wen/Was?** → _Tân ngữ_ bị tác động
3. **_Dativ_** = **Wem?** → _Ai_ nhận được lợi ích

**Thứ tự trong câu:** \`Nominativ\` + **Verb** + **_Dativ_** + **_Akkusativ_**

_Ví dụ:_ **Ich** _(Nom)_ gebe **dem Kind** _(Dat)_ **_das Buch_** _(Akk)_
:::`

  // Test our regex
  const admonitionRegex = /:::(\w+)(?:\[([^\]]+)\])?\s*\n([\s\S]*?)\n:::/g
  const matches = [...testContent.matchAll(admonitionRegex)]
  
  // Test our preprocessor
  const processed = preprocessAdmonitions(testContent)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Regex Debug Test</h1>
      
      <div className="mb-8">
        <h2>Original Content:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {testContent}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2>Regex Matches Found: {matches.length}</h2>
        {matches.map((match, i) => (
          <div key={i} className="mb-4 p-4 border rounded">
            <p><strong>Match {i + 1}:</strong></p>
            <p>Type: {match[1]}</p>
            <p>Title: {match[2] || 'No title'}</p>
            <p>Content length: {match[3]?.length || 0}</p>
            <pre className="bg-blue-50 p-2 rounded text-xs mt-2">
              {match[3]?.substring(0, 200)}...
            </pre>
          </div>
        ))}
      </div>
      
      <div className="mb-8">
        <h2>Preprocessor Output:</h2>
        <pre className="bg-green-100 p-4 rounded text-sm whitespace-pre-wrap">
          {processed}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2>Rendered Result:</h2>
        <div 
          className="prose max-w-none border-2 border-red-300 p-4 rounded"
          dangerouslySetInnerHTML={{ __html: processed }}
        />
      </div>
    </div>
  )
}
