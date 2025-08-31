# Content Management Guide

## 📁 Cấu trúc thư mục

### 1. Content (Files .md/.mdx)
```
src/content/
├── a1niveau/
│   ├── grammatik/       # Ngữ pháp A1
│   ├── wortschatz/      # Từ vựng A1  
│   └── uebungen/        # Bài tập A1
├── a2niveau/
│   ├── grammatik/       # Ngữ pháp A2
│   ├── wortschatz/      # Từ vựng A2
│   └── uebungen/        # Bài tập A2
├── b1niveau/
│   ├── grammatik/       # Ngữ pháp B1
│   ├── wortschatz/      # Từ vựng B1
│   └── uebungen/        # Bài tập B1
└── b2niveau/
    ├── grammatik/       # Ngữ pháp B2
    ├── wortschatz/      # Từ vựng B2
    └── uebungen/        # Bài tập B2
```

### 2. Images (Hình ảnh minh họa)
```
public/images/
├── a1niveau/            # Ảnh cho nội dung A1
├── a2niveau/            # Ảnh cho nội dung A2
├── b1niveau/            # Ảnh cho nội dung B1
├── b2niveau/            # Ảnh cho nội dung B2
└── shared/              # Ảnh dùng chung
```

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
