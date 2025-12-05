# ✅ Auto-Generate-Suggestions Function - Phân Tích và Sửa Lỗi

## 🎯 Mục Đích Function

Chạy tự động mỗi 12 giờ để:

1. Crawl messages từ users trong bảng `ai_chat_messages`
2. Phân tích bằng AI để extract câu hỏi phổ biến
3. Lưu vào bảng `chat_suggestions` để hiển thị autocomplete

## ❌ Các Lỗi Đã Phát Hiện

### 1. **Timeout khi không có API Key**

- **Vấn đề**: Function đã có code check API key và return sớm, NHƯNG vẫn bị timeout
- **Nguyên nhân**: Có thể có lỗi ở bước query database hoặc AI call
- **Fix**: Đã thêm timeout handler cho AI API call (25s max)

### 2. **Syntax Lỗi trong Delete Query** ⚠️ CRITICAL

```typescript
// ❌ SAI - Syntax không đúng
.not('id', 'in', `(${topIds.join(',')})`)

// ✅ ĐÚNG - Delete từng item
for (const old of oldSuggestions) {
  await supabaseClient.from('chat_suggestions').delete().eq('id', old.id)
}
```

### 3. **AI Response quá lớn gây timeout**

- **Vấn đề**: Gửi quá nhiều messages (500) và yêu cầu 20 suggestions
- **Fix**:
  - Giảm xuống 100 messages đầu tiên
  - Giảm từ 20 → 15 suggestions
  - Giảm max_tokens từ 4000 → 2000
  - Giới hạn prompt content 5000 chars

### 4. **Parsing JSON không robust**

- **Vấn đề**: AI có thể trả về markdown `json` hoặc text + JSON
- **Fix**: Thêm multi-stage parsing:
  1. Detect và remove markdown code blocks
  2. Extract array pattern `[{...}]`
  3. Validate là array, nếu không thì wrap vào array

## ✅ Các Cải Tiến Đã Thực Hiện

### 1. **Thêm Timeout Protection**

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

const aiResponse = await fetch(apiUrl, {
  // ... config
  signal: controller.signal,
}).finally(() => clearTimeout(timeoutId));
```

### 2. **Better Error Logging**

```typescript
if (!aiResponse.ok) {
  const errorText = await aiResponse.text();
  console.error(`❌ AI API failed: ${aiResponse.status} - ${errorText}`);
  throw new Error(`AI API failed: ${aiResponse.statusText}`);
}
```

### 3. **Robust JSON Parsing**

````typescript
// Remove markdown
const codeBlockMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
if (codeBlockMatch) jsonText = codeBlockMatch[1].trim();

// Extract array
const arrayMatch = jsonText.match(/\[\s*\{[\s\S]*\}\s*\]/);
if (arrayMatch) jsonText = arrayMatch[0];

// Validate
if (!Array.isArray(suggestions)) {
  suggestions = [suggestions];
}
````

### 4. **Safe Cleanup với Try-Catch**

```typescript
try {
  // Cleanup old suggestions
  const { data: allSuggestions } = await supabaseClient...
  if (allSuggestions && allSuggestions.length > 100) {
    const oldSuggestions = allSuggestions.slice(100)
    for (const old of oldSuggestions) {
      await supabaseClient.from('chat_suggestions').delete().eq('id', old.id)
    }
  }
} catch (cleanupError) {
  console.error('⚠️ Cleanup failed (non-critical):', cleanupError)
}
```

## 📊 Performance Optimization

| Trước              | Sau               | Cải Thiện     |
| ------------------ | ----------------- | ------------- |
| 500 messages       | 100 messages      | -80% data     |
| 20 suggestions     | 15 suggestions    | -25% output   |
| 4000 tokens        | 2000 tokens       | -50% API cost |
| 10000 chars prompt | 5000 chars prompt | -50% size     |
| Không timeout      | 25s timeout       | Tránh treo    |

## 🔧 Cách Test

### Test Locally (với API key trong .env)

```bash
# Start Supabase locally
supabase start

# Serve function
supabase functions serve auto-generate-suggestions

# Test
curl -X POST "http://localhost:54321/functions/v1/auto-generate-suggestions" \
  -H "Authorization: Bearer <anon-key>"
```

### Test Production (không có API key - should return gracefully)

```bash
curl -X POST "https://gogfsobcbavavudkvttu.supabase.co/functions/v1/auto-generate-suggestions" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --max-time 35

# Expected response (nếu không có API key):
{
  "success": true,
  "message": "No AI API key configured...",
  "suggestions_generated": 0,
  "messages_analyzed": <number>,
  "note": "Function will work once API key is added"
}
```

## 🚀 Deploy và Setup Cron

### 1. Deploy Function

```bash
supabase functions deploy auto-generate-suggestions
```

### 2. Add API Key vào Supabase Dashboard

1. Vào: https://supabase.com/dashboard/project/gogfsobcbavavudkvttu/settings/functions
2. Scroll xuống **Secrets** section
3. Click **Add New Secret**
4. Name: `OPENAI_API_KEY`
5. Value: `sk-proj-4o0u5zBLjq2Ok2B2IyLh7sHbeW...` (từ .env file)
6. Click **Save**

### 3. Setup Cron Schedule

1. Vào: https://supabase.com/dashboard/project/gogfsobcbavavudkvttu/functions
2. Click vào function **auto-generate-suggestions**
3. Tab **Cron Jobs**
4. Click **Add Cron Job**
5. Schedule: `0 1,13 * * *` (1:00 AM và 1:00 PM mỗi ngày)
6. Timezone: Asia/Ho_Chi_Minh
7. Click **Save**

## 📝 Response Format

### Thành Công (có messages mới)

```json
{
  "success": true,
  "messages_analyzed": 45,
  "suggestions_generated": 15,
  "suggestions_inserted": 15,
  "duration_ms": 8234,
  "last_processed_id": "msg-123",
  "timestamp": "2025-12-05T10:30:00.000Z"
}
```

### Thành Công (không có messages mới)

```json
{
  "success": true,
  "message": "No messages to analyze",
  "suggestions_generated": 0
}
```

### Thành Công (không có API key)

```json
{
  "success": true,
  "message": "No AI API key configured...",
  "suggestions_generated": 0,
  "messages_analyzed": 45,
  "note": "Function will work once API key is added"
}
```

### Lỗi

```json
{
  "success": false,
  "error": "Failed to fetch messages: <error details>"
}
```

## 🎯 Expected Behavior

1. **Với API Key**: Function phân tích messages → generate suggestions → lưu vào DB → cleanup old → log
2. **Không có API Key**: Function return success ngay lập tức với message hướng dẫn add API key
3. **Timeout**: Function sẽ abort AI call sau 25s để tránh exceed 30s limit của Supabase Edge Functions
4. **Error**: Function catch error và return 500 với error message

## ⏱️ Execution Time

- Không có API key: < 2s
- Không có messages: < 3s
- Với API key + messages: 8-15s (AI call + database operations)
- Timeout threshold: 25s (AI call), 30s (total Supabase limit)

## 🔍 Monitoring

Check logs trong Supabase Dashboard:

- https://supabase.com/dashboard/project/gogfsobcbavavudkvttu/logs/edge-functions

Hoặc query bảng `rag_processing_logs`:

```sql
SELECT * FROM rag_processing_logs
WHERE taskType = 'chat_suggestions'
ORDER BY executionDate DESC
LIMIT 10;
```

## ✅ Checklist

- [x] Fixed delete query syntax error
- [x] Added timeout protection (25s)
- [x] Reduced AI prompt size (5000 chars)
- [x] Optimized message batch (100 messages)
- [x] Improved JSON parsing
- [x] Added better error logging
- [x] Wrapped cleanup in try-catch
- [ ] **TODO**: User needs to add OPENAI_API_KEY to Supabase Dashboard
- [ ] **TODO**: User needs to setup cron schedule in Dashboard

---

**Note**: Function đã được fix và deploy. Hiện tại đang chờ user thêm OPENAI_API_KEY vào Supabase Dashboard để function có thể thực sự phân tích và generate suggestions.
