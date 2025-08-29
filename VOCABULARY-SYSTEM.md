# Hệ thống từ vựng tiếng Đức - Phân cấp theo CEFR

## Tổng quan

Chúng ta đã xây dựng thành công một hệ thống thư viện từ vựng tiếng Đức hoàn chỉnh với cấu trúc phân cấp theo tiêu chuẩn CEFR (A1 đến C2), được tổ chức theo các chủ đề cụ thể.

## Cấu trúc Database

### 1. VocabularyLevel (Cấp độ)
- **A1** - Grundstufe A1 (Cấp độ cơ bản)
- **A2** - Grundstufe A2 (Cấp độ cơ bản nâng cao)  
- **B1** - Mittelstufe B1 (Cấp độ trung cấp)
- **B2** - Mittelstufe B2 (Cấp độ trung cấp nâng cao)
- **C1** - Oberstufe C1 (Cấp độ cao)
- **C2** - Oberstufe C2 (Cấp độ thành thạo)

### 2. VocabularyTopic (Chủ đề)
Mỗi cấp độ có các chủ đề riêng:

**A1:**
- Familie (Gia đình)
- Wohnen (Nhà ở)
- Essen (Ăn uống)
- Kleidung (Quần áo)
- Freizeit (Thời gian rảnh)

**A2:**
- Reisen (Du lịch)
- Gesundheit (Sức khỏe)
- Schule (Trường học)
- Einkaufen (Mua sắm)

**B1:**
- Beruf (Nghề nghiệp)
- Medien (Truyền thông)
- Umwelt (Môi trường)
- Kultur (Văn hóa)

**B2:**
- Politik (Chính trị)
- Wissenschaft (Khoa học)
- Literatur (Văn học)

### 3. VocabularyEntry (Từ vựng)
Mỗi từ vựng bao gồm:
- Từ tiếng Đức (german)
- Nghĩa tiếng Việt (vietnamese)
- Phiên âm (phonetic)
- Số nhiều (plural)
- Loại từ (type): NOMEN, VERB, ADJEKTIV, ADVERB, etc.
- Ví dụ tiếng Đức và tiếng Việt
- Độ khó (difficulty): 1-5
- Tags phân loại

## Cấu trúc thư mục

```
src/data/vocabulary/
├── A1/
│   ├── familie.json
│   ├── wohnen.json
│   ├── essen.json
│   └── kleidung.json
├── A2/
│   └── reisen.json
├── B1/
│   ├── beruf.json
│   └── umwelt.json
└── B2/
    └── (các file sẽ được thêm)
```

## API Endpoints

### 1. Levels API
- `GET /api/vocabulary/levels` - Lấy tất cả cấp độ và chủ đề
- `POST /api/vocabulary/levels` - Tạo cấp độ mới (admin)

### 2. Topics API  
- `GET /api/vocabulary/topics?level=A1` - Lấy chủ đề theo cấp độ
- `POST /api/vocabulary/topics` - Tạo chủ đề mới (admin)

### 3. Vocabulary API
- `GET /api/vocabulary` - Lấy từ vựng với filter
- `GET /api/vocabulary/A1/wohnen` - Lấy từ vựng theo cấp độ và chủ đề
- `POST /api/vocabulary` - Thêm từ vựng mới

## Trang web

### 1. Trang chính - `/vocabulary-new`
- Hiển thị tất cả cấp độ và chủ đề
- Thống kê số lượng từ vựng cho mỗi chủ đề
- Navigation dễ sử dụng

### 2. Trang chi tiết - `/vocabulary-new/A1/wohnen`
- Hiển thị danh sách từ vựng của chủ đề
- Tìm kiếm từ vựng
- Hiển thị đầy đủ thông tin: phiên âm, ví dụ, loại từ, độ khó

### 3. Trang quản lý - `/admin/vocabulary-manager`
- Quản lý từ vựng theo cấp độ và chủ đề
- Thêm từ vựng mới
- Hiển thị danh sách từ vựng dạng bảng

## Scripts và Tools

### 1. Seed Script - `prisma/seed-new.ts`
- Tạo cấu trúc cấp độ và chủ đề
- Import từ vựng từ files JSON
- Chạy: `npx tsx prisma/seed-new.ts`

### 2. Migration Script - `scripts/migrate-vocabulary.ts`
- Di chuyển dữ liệu từ cấu trúc cũ sang mới
- Mapping các file cũ vào cấu trúc phân cấp
- Chạy: `npx tsx scripts/migrate-vocabulary.ts`

### 3. Vocabulary Service - `lib/vocabulary-service.ts`
- Helper functions để làm việc với API
- TypeScript interfaces
- Utility functions cho search và filter

## Thống kê hiện tại

- **Tổng số từ vựng**: 290 từ
- **A1**: 38 từ (4 chủ đề)
- **A2**: 5 từ (1 chủ đề) 
- **B1**: 247 từ (3 chủ đề)

## Cách sử dụng

### 1. Thêm từ vựng mới
1. Tạo file JSON trong thư mục tương ứng
2. Chạy seed script để import vào database
3. Hoặc sử dụng trang admin để thêm từng từ

### 2. Thêm chủ đề mới
1. Cập nhật `vocabularyTopics` trong seed script
2. Chạy lại seed script
3. Tạo file JSON tương ứng

### 3. Thêm cấp độ mới
1. Cập nhật `vocabularyLevels` trong seed script
2. Thêm chủ đề cho cấp độ mới
3. Chạy lại seed script

## Tính năng nổi bật

✅ **Cấu trúc phân cấp rõ ràng** - Theo tiêu chuẩn CEFR quốc tế

✅ **Database tối ưu** - Relations và indexing hiệu quả

✅ **API RESTful** - Endpoints đầy đủ và linh hoạt

✅ **UI/UX thân thiện** - Giao diện đẹp và dễ sử dụng

✅ **Admin panel** - Quản lý từ vựng dễ dàng

✅ **Search & Filter** - Tìm kiếm nhanh chóng

✅ **Responsive** - Tương thích mobile

✅ **TypeScript** - Type safety đầy đủ

## Kế hoạch phát triển

### Phase 2:
- [ ] Thêm audio phát âm
- [ ] Flashcard system
- [ ] Quiz và bài test
- [ ] Progress tracking cho user
- [ ] Bookmark từ vựng yêu thích

### Phase 3:
- [ ] Spaced repetition algorithm
- [ ] Gamification elements
- [ ] Social features (share, comment)
- [ ] Export/Import từ vựng
- [ ] Mobile app

## Cài đặt và chạy

```bash
# Clone repository
git clone [repo-url]

# Install dependencies
npm install

# Setup database
docker-compose up -d
npx prisma db push
npx tsx prisma/seed-new.ts

# Start development server
npm run dev
```

Truy cập:
- Thư viện từ vựng: http://localhost:9002/vocabulary-new
- Quản lý admin: http://localhost:9002/admin/vocabulary-manager

---

**Kết luận**: Chúng ta đã xây dựng thành công một hệ thống thư viện từ vựng tiếng Đức hoàn chỉnh với cấu trúc phân cấp khoa học, database tối ưu, và giao diện người dùng thân thiện. Hệ thống sẵn sàng cho việc mở rộng và phát triển thêm các tính năng học tập nâng cao.
