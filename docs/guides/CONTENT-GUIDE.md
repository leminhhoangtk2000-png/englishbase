# Content Management Guide

## 📁 Cấu trúc thư mục

### 1. Learning Content (.md/.mdx files) - `src/content/`
```
src/content/
├── a1niveau/
│   ├── grammatik/       # Ngữ pháp A1 (MD files)
│   └── uebungen/        # Bài tập A1 (MD files)
├── a2niveau/
│   ├── grammatik/       # Ngữ pháp A2 (MD files)
│   └── uebungen/        # Bài tập A2 (MD files)
├── b1niveau/
│   ├── grammatik/       # Ngữ pháp B1 (MD files)
│   └── uebungen/        # Bài tập B1 (MD files)
└── b2niveau/
    ├── grammatik/       # Ngữ pháp B2 (MD files)
    └── uebungen/        # Bài tập B2 (MD files)
```

### 2. Vocabulary Database (JSON files) - `src/data/vocabulary/`
```
src/data/vocabulary/
├── a1/                  # JSON files cho từ vựng A1
├── a2/                  # JSON files cho từ vựng A2
├── b1/                  # JSON files cho từ vựng B1
└── b2/                  # JSON files cho từ vựng B2
```

### 3. Images (Static assets) - `public/images/`
```
public/images/
├── a1niveau/            # Ảnh cho nội dung A1
├── a2niveau/            # Ảnh cho nội dung A2
├── b1niveau/            # Ảnh cho nội dung B1
├── b2niveau/            # Ảnh cho nội dung B2
└── shared/              # Ảnh dùng chung
```

## 🎯 Phân biệt rõ ràng:

### **Vocabulary** → Database-driven 
- **Location**: `src/data/vocabulary/[level]/`
- **Format**: JSON files
- **Usage**: Seed vào PostgreSQL, hiển thị qua API
- **URL**: `/vocabulary` page với database

### **Grammar/Exercises** → File-based content
- **Location**: `src/content/[niveau]/`  
- **Format**: Markdown files với frontmatter
- **Usage**: Static content, processed by Next.js
- **URL**: `/[niveau]/grammatik/[slug]`

## 📝 Hướng dẫn sử dụng

### Upload Content (.md/.mdx files):
1. **Chọn cấp độ**: a1niveau, a2niveau, b1niveau, b2niveau
2. **Chọn loại**: grammatik, wortschatz, uebungen
3. **Upload file**: Đặt file .md/.mdx vào thư mục tương ứng

### Upload Images:
1. **Theo cấp độ**: Đặt ảnh vào thư mục `/public/images/[niveau]/`
2. **Ảnh dùng chung**: Đặt vào `/public/images/shared/`
3. **Reference trong MD**: Sử dụng `/images/[niveau]/filename.jpg`

### Naming Convention:
- **Content files**: `kebab-case.md` (vd: `perfekt-tense.md`)
- **Image files**: `kebab-case.jpg/png` (vd: `perfekt-example.jpg`)

### Example Usage trong .md:
```markdown
# Perfekt Tense

![Perfekt Example](/images/a1niveau/perfekt-example.jpg)

Đây là bài học về thì Perfekt...
```

## 🔗 URL Mapping:
- Content: `/a1niveau/grammatik/perfekt-tense`
- Image: `/images/a1niveau/perfekt-example.jpg`
