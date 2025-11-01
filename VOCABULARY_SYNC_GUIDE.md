# 📚 Hướng Dẫn Đồng Bộ Từ Vựng (Vocabulary Cloud Sync)

**Ngày:** 1 tháng 11, 2025  
**Trạng thái:** ✅ Đã hoàn thành

---

## 🎯 Vấn Đề Đã Giải Quyết

### ❌ Trước Đây:
- Từ vựng chỉ lưu trong **localStorage** (browser)
- Đổi máy/browser → **MẤT HẾT** từ vựng đã lưu
- Không thể access từ nhiều thiết bị

### ✅ Bây Giờ:
- Từ vựng lưu trong **Database** (PostgreSQL)
- Đăng nhập bất kỳ đâu → **TỰ ĐỘNG SYNC**
- Access từ mọi thiết bị, browser
- Offline-first với localStorage backup

---

## 🔄 Flow Hoạt Động

```
┌─────────────────────────────────────────────────────────────┐
│  USER SAVES VOCABULARY                                      │
└───────────────┬─────────────────────────────────────────────┘
                │
                ▼
┌───────────────────────────────────────────────────────────┐
│  1. Optimistic Update (Update UI ngay lập tức)            │
│     → User thấy từ vựng được save instant                  │
└───────────────┬───────────────────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ User Logged In? │
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
      YES              NO
        │               │
        ▼               ▼
┌────────────────┐  ┌──────────────────┐
│ Save to DB     │  │ Save localStorage│
│ + localStorage │  │ only             │
└────────┬───────┘  └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  DATABASE SYNC                                           │
│  ✓ POST /api/user/vocabulary → Create UserVocabulary    │
│  ✓ Record: userId + vocabularyId                        │
└──────────────────────────────────────────────────────────┘
```

### 🔁 Auto Sync Khi Login

```
User Login/Refresh Page
         │
         ▼
┌──────────────────────────────────────────────────────────┐
│  AUTO SYNC TRIGGERED                                     │
│  → useEffect detects user logged in                      │
└────────────┬──────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  FETCH FROM DATABASE                                     │
│  GET /api/user/vocabulary?limit=1000                     │
│  → Load all saved vocabulary                             │
└────────────┬──────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  MERGE DATA                                              │
│  1. Get vocabulary from database                         │
│  2. Get vocabulary from localStorage                     │
│  3. Merge: DB first, add unique local items              │
│  4. Sync local-only items to database                    │
└────────────┬──────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────┐
│  UPDATE UI                                               │
│  → Display merged vocabulary list                        │
│  → User sees all saved words from all devices            │
└──────────────────────────────────────────────────────────┘
```

---

## 📂 Files Đã Tạo/Sửa

### 🆕 Files Mới

1. **`src/app/api/user/vocabulary/route.ts`** - API endpoints
   - `GET` - Load saved vocabulary
   - `POST` - Save vocabulary
   - `DELETE` - Remove vocabulary

### ✏️ Files Đã Sửa

1. **`src/hooks/use-vocabulary.tsx`**
   - Thêm `useAuth` để check user login
   - Update `addToSaved()` → async, save to database
   - Update `removeFromSaved()` → async, remove from database
   - Thêm `syncWithDatabase()` → auto sync khi login
   - Thêm `isSyncing` state → show loading indicator

---

## 🔧 API Endpoints

### 1️⃣ GET /api/user/vocabulary

**Load tất cả từ vựng đã lưu của user**

**Request:**
```http
GET /api/user/vocabulary?limit=100&offset=0&status=NEW
Authorization: Cookie (auth-token)
```

**Query Parameters:**
- `limit` (optional) - Number of items (default: 100)
- `offset` (optional) - Pagination offset (default: 0)
- `status` (optional) - Filter by learning status (NEW, LEARNING, LEARNED, MASTERED)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "vocab-id-123",
      "german": "der Hund",
      "vietnamese": "con chó",
      "phonetic": "dea hunt",
      "type": "NOMEN",
      "level": {
        "name": "A1",
        "displayName": "A1 - Cơ Bản"
      },
      "topic": {
        "name": "tiere",
        "displayName": "Động Vật",
        "slug": "tiere"
      },
      "userStatus": "NEW",
      "correctCount": 0,
      "totalAttempts": 0,
      "savedAt": "2025-11-01T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 100,
    "offset": 0,
    "hasMore": true
  }
}
```

---

### 2️⃣ POST /api/user/vocabulary

**Save từ vựng vào danh sách của user**

**Request:**
```http
POST /api/user/vocabulary
Authorization: Cookie (auth-token)
Content-Type: application/json

{
  "vocabularyId": "vocab-id-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vocabulary saved successfully",
  "data": {
    "id": "user-vocab-id-456",
    "userId": "user-id-789",
    "vocabularyId": "vocab-id-123",
    "status": "NEW",
    "createdAt": "2025-11-01T10:00:00Z"
  }
}
```

---

### 3️⃣ DELETE /api/user/vocabulary

**Xóa từ vựng khỏi danh sách đã lưu**

**Request:**
```http
DELETE /api/user/vocabulary?vocabularyId=vocab-id-123
Authorization: Cookie (auth-token)
```

**Response:**
```json
{
  "success": true,
  "message": "Vocabulary removed successfully"
}
```

---

## 💻 Cách Sử Dụng Trong Code

### Trong Component

```typescript
import { useVocabulary } from '@/hooks/use-vocabulary';

function MyComponent() {
  const { 
    savedVocabulary,    // Danh sách từ vựng đã lưu
    addToSaved,         // Function để save từ vựng
    removeFromSaved,    // Function để remove từ vựng
    isWordSaved,        // Check xem từ đã save chưa
    syncWithDatabase,   // Manual sync với database
    isSyncing,          // Loading state
  } = useVocabulary();

  // Save vocabulary
  const handleSave = async (word) => {
    await addToSaved(word);
    // UI update ngay lập tức (optimistic update)
    // Database sync ở background
  };

  // Remove vocabulary
  const handleRemove = async (wordId) => {
    await removeFromSaved(wordId);
  };

  // Check if saved
  const isSaved = isWordSaved('vocab-id-123');

  // Manual sync (nếu cần)
  const handleSync = async () => {
    await syncWithDatabase();
  };

  return (
    <div>
      {isSyncing && <div>Đang đồng bộ...</div>}
      
      {savedVocabulary.map(word => (
        <div key={word.id}>
          {word.german} - {word.vietnamese}
          <button onClick={() => handleRemove(word.id)}>
            Xóa
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔐 Security Features

### ✅ Authentication Required
- Tất cả API endpoints đều require user login
- JWT token verification
- User chỉ có thể access/modify vocabulary của mình

### ✅ Rate Limiting
- Prevent spam/abuse
- 100 requests/minute cho API endpoints

### ✅ Data Isolation
- User A không thể xem/sửa vocabulary của User B
- Foreign key constraints trong database

---

## 🎨 User Experience

### ⚡ Optimistic Updates
- UI update **ngay lập tức** khi user save/remove
- Database sync ở background
- Không có lag/delay

### 💾 Offline Support
- Vẫn lưu được vào localStorage khi offline
- Auto sync khi online lại
- Merge conflicts resolution tự động

### 🔄 Auto Sync
- Sync tự động khi login
- Sync tự động khi refresh page
- Manual sync button (nếu cần)

---

## 🧪 Testing Flow

### Test Case 1: Save và Sync
1. **Không login** → Save từ vựng → Chỉ lưu localStorage
2. **Login** → Auto sync → Từ vựng upload lên database
3. **Đổi browser** → Login → Load từ database → Hiện từ vựng đã save

### Test Case 2: Multi-Device
1. **Device A** → Login → Save 10 từ
2. **Device B** → Login → Thấy cùng 10 từ
3. **Device B** → Save thêm 5 từ
4. **Device A** → Refresh → Thấy cả 15 từ

### Test Case 3: Offline → Online
1. **Offline** → Save 5 từ vào localStorage
2. **Online** → Auto sync → 5 từ upload lên database
3. **Đổi device** → Login → Thấy 5 từ

---

## 📊 Database Schema

```sql
-- UserVocabulary Table
CREATE TABLE user_vocabulary (
  id            TEXT PRIMARY KEY,
  userId        TEXT NOT NULL,
  vocabularyId  TEXT NOT NULL,
  status        TEXT DEFAULT 'NEW',  -- NEW, LEARNING, LEARNED, MASTERED
  correctCount  INTEGER DEFAULT 0,
  totalAttempts INTEGER DEFAULT 0,
  lastReviewed  TIMESTAMP,
  nextReview    TIMESTAMP,
  difficulty    INTEGER DEFAULT 1,
  createdAt     TIMESTAMP DEFAULT NOW(),
  updatedAt     TIMESTAMP DEFAULT NOW(),
  
  -- Foreign Keys
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vocabularyId) REFERENCES vocabulary_entries(id) ON DELETE CASCADE,
  
  -- Unique constraint
  UNIQUE(userId, vocabularyId)
);

-- Indexes for performance
CREATE INDEX idx_user_vocabulary_userId ON user_vocabulary(userId);
CREATE INDEX idx_user_vocabulary_status ON user_vocabulary(status);
CREATE INDEX idx_user_vocabulary_updatedAt ON user_vocabulary(updatedAt);
```

---

## 🚀 Benefits

### Cho User
✅ Access từ vựng từ mọi device  
✅ Không lo mất data khi đổi máy/browser  
✅ Offline support với localStorage  
✅ UI response nhanh (optimistic updates)  

### Cho Developer
✅ Clean architecture với separation of concerns  
✅ Reusable hook (useVocabulary)  
✅ Type-safe với TypeScript  
✅ Error handling & retry logic  
✅ Rate limiting built-in  

---

## 🔮 Future Enhancements (Optional)

### 1. Learning Statistics
- Track learning progress
- Show statistics (mastered words, study time, etc.)
- Spaced repetition algorithm

### 2. Export/Import
- Export vocabulary to CSV/Excel
- Import from other sources
- Share vocabulary lists

### 3. Collaborative Features
- Share vocabulary lists with friends
- Public vocabulary collections
- Community contributions

### 4. Advanced Sync
- Real-time sync với WebSocket
- Conflict resolution cho simultaneous edits
- Sync history/versions

---

## 🐛 Troubleshooting

### Issue: Từ vựng không sync
**Solution:**
1. Check user đã login chưa
2. Check network connection
3. Check console logs
4. Call `syncWithDatabase()` manually

### Issue: Duplicate vocabulary
**Solution:**
- Database có unique constraint (userId + vocabularyId)
- Tự động deduplicate khi merge

### Issue: Slow loading
**Solution:**
- Pagination đã implement (limit 100 items)
- Index trên database
- Client-side caching với localStorage

---

## 📞 Support

Nếu có vấn đề:
1. Check browser console logs
2. Check network tab trong DevTools
3. Verify JWT token còn valid
4. Clear localStorage và re-login

---

**Completed by:** AI Assistant  
**Date:** November 1, 2025  
**Status:** ✅ Production Ready

