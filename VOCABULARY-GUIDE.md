# Vocabulary Database Management

## 📂 Cấu trúc thư mục từ vựng

```
src/data/vocabulary/
├── a1/              # Từ vựng cấp độ A1
├── a2/              # Từ vựng cấp độ A2  
├── b1/              # Từ vựng cấp độ B1
└── b2/              # Từ vựng cấp độ B2
```

## 📋 Workflow cho vocabulary

### 1. Upload JSON files:
- **Đặt file JSON** vào thư mục level tương ứng: `src/data/vocabulary/[level]/`
- **Format file**: `topic-name.json` (vd: `essen.json`, `beruf.json`)

### 2. Auto-import vào database:
- Files sẽ được đọc bởi `src/lib/vocabulary-data.ts` 
- Seed vào PostgreSQL bằng `npm run db:seed`
- Accessible qua API `/api/vocabulary`

### 3. JSON Structure:
```json
{
  "topic": "essen",
  "level": "a1", 
  "displayName": "Essen und Trinken",
  "vocabulary": [
    {
      "german": "das Brot",
      "vietnamese": "bánh mì",
      "type": "noun",
      "examples": {
        "german": "Ich esse Brot zum Frühstück.",
        "vietnamese": "Tôi ăn bánh mì vào bữa sáng."
      }
    }
  ]
}
```

## 🔄 Commands

### Seed vocabulary vào database:
```bash
npm run db:seed
```

### Kiểm tra vocabulary levels:
```bash
npm run test:vocabulary
```

### Reset vocabulary database:
```bash
npm run db:reset
npm run db:seed
```

## 📍 File locations hiện tại:

### A1 Level:
- essen.json
- familie.json  
- kleidung.json
- vocabulary-wohnen.json
- wohnen.json

### B1 Level:
- beruf.json
- umwelt.json
- vocabulary-body-comprehensive-b1.json
- vocabulary-complete-all-b1.json  
- vocabulary-comprehensive-all-b1.json
- vocabulary-extended-all-b1.json
- vocabulary-verbs-adjectives-b1.json

## ✅ Workflow upload mới:

1. **Chuẩn bị file JSON** theo format trên
2. **Upload vào**: `src/data/vocabulary/[level]/filename.json`
3. **Update imports** trong `src/lib/vocabulary-data.ts` (nếu cần)
4. **Chạy seed**: `npm run db:seed`
5. **Test**: Kiểm tra tại `/vocabulary` page
