# Hệ thống Markdown Content cho Edu-theme

## 📚 Tổng quan

Hệ thống này cho phép bạn tạo và quản lý nội dung học tiếng Đức bằng các file Markdown (.md) một cách tự động. Chỉ cần tạo file `.md` trong thư mục `content/`, hệ thống sẽ tự động đọc và hiển thị trên website.

## 🗂️ Cấu trúc thư mục

```
content/
├── a1niveau/
│   ├── grammatik/
│   │   ├── 01-chia-dong-tu-hien-tai.md
│   │   └── 02-modal-verben.md
│   └── wortschatz/
│       ├── 01-familie.md
│       └── 02-berufe.md
├── a2niveau/
│   └── grammatik/
│       └── 01-praeteritum.md
├── b1niveau/
│   └── grammatik/
│       └── 01-konjunktiv-ii.md
└── b2niveau/
    └── (coming soon...)
```

## 📝 Format file Markdown

Mỗi file markdown phải có **frontmatter** ở đầu file:

```markdown
---
title: "Tiêu đề bài học"
description: "Mô tả ngắn gọn về bài học"
date: "2025-01-30"
author: "Deutsch.vn"
tags: ["grammatik", "verben", "präsens"]
level: "A1"
order: 1
---

# Nội dung bài học

Nội dung markdown ở đây...
```

### 📋 Các trường bắt buộc:

- **title**: Tiêu đề bài học (hiển thị trên web)
- **description**: Mô tả ngắn (hiển thị trong danh sách)
- **date**: Ngày tạo bài
- **level**: Cấp độ (A1, A2, B1, B2)
- **order**: Thứ tự hiển thị (số nhỏ hơn hiển thị trước)

### 📋 Các trường tùy chọn:

- **author**: Tác giả
- **tags**: Danh sách tag để phân loại

## 🚀 Cách thêm bài học mới

### Bước 1: Tạo file markdown
```bash
# Ví dụ: Thêm bài học về Perfekt cho A2
touch content/a2niveau/grammatik/02-perfekt.md
```

### Bước 2: Thêm frontmatter và nội dung
```markdown
---
title: "Thì hoàn thành - Perfekt"
description: "Học cách sử dụng thì hoàn thành trong tiếng Đức"
date: "2025-01-30"
author: "Deutsch.vn"
tags: ["grammatik", "perfekt", "vergangenheit"]
level: "A2"
order: 2
---

# Nội dung bài học...
```

### Bước 3: Tự động hiển thị
- File sẽ tự động được phát hiện và hiển thị tại `/a2niveau/grammatik/02-perfekt`
- Sẽ xuất hiện trong danh sách tại `/a2niveau` và `/a2niveau/grammatik`

## 🎨 Styling đặc biệt

### Note boxes (Hộp ghi chú):
```markdown
:::note
Nội dung ghi chú quan trọng sẽ được highlight
:::
```

### Bảng:
```markdown
|**Deutsch**|**Tiếng Việt**|
|---|---|
|**Hallo**|Xin chào|
```

### Code và từ vựng:
```markdown
- **Ich bin** Student. _(Tôi là sinh viên.)_
- `der Student` = sinh viên
```

## 📁 Tổ chức nội dung

### Theo niveau:
- **a1niveau/**: Cơ bản (A1)
- **a2niveau/**: Cơ bản nâng cao (A2)  
- **b1niveau/**: Trung cấp (B1)
- **b2niveau/**: Trung cấp khá (B2)

### Theo chủ đề:
- **grammatik/**: Ngữ pháp
- **wortschatz/**: Từ vựng
- **hoeren/**: Luyện nghe (future)
- **sprechen/**: Luyện nói (future)
- **lesen/**: Luyện đọc (future)
- **schreiben/**: Luyện viết (future)

## 🔧 Tính năng kỹ thuật

### Tự động navigation:
- Hệ thống tự động tạo menu điều hướng từ cấu trúc file
- Sắp xếp theo trường `order` trong frontmatter

### Responsive design:
- Tương thích với mọi thiết bị
- Table of Contents tự động (TOC)

### SEO friendly:
- URL clean: `/a1niveau/grammatik/01-chia-dong-tu-hien-tai`
- Meta description từ frontmatter

## 🛠️ Phát triển

### Thêm niveau mới:
1. Tạo thư mục: `content/c1niveau/`
2. Cập nhật: `src/lib/markdown.ts` (nếu cần)
3. Thêm config: `src/config/c1niveau.ts`

### Thêm section mới:
1. Tạo thư mục trong niveau: `content/a1niveau/neue-section/`
2. Thêm file markdown trong section
3. Tự động xuất hiện trong navigation

## 🚨 Lưu ý quan trọng

1. **File naming**: Sử dụng format `01-ten-bai-hoc.md` để dễ sắp xếp
2. **Character encoding**: Luôn sử dụng UTF-8
3. **Images**: Đặt trong `public/images/` và link bằng `/images/...`
4. **No spaces**: Tên file không được có dấu cách

## 🌟 Tips viết content hiệu quả

1. **Cấu trúc rõ ràng**: Sử dụng heading (## 🔹) để phân chia nội dung
2. **Ví dụ thực tế**: Luôn có ví dụ kèm phiên âm và dịch nghĩa
3. **Bài tập**: Cuối mỗi bài có link bài tập thực hành
4. **Emoji**: Sử dụng emoji để tạo điểm nhấn và dễ đọc

Happy writing! 🚀
