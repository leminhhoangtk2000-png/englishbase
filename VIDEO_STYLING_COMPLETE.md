# 🎥 Video Styling - Căn Giữa & Bo Góc 20px

## ✅ Đã Hoàn Thành

### 📝 Thay Đổi

#### 1. **Global CSS** (`src/app/globals.css`)
Thêm CSS toàn cục cho tất cả video và iframe:

```css
/* Video and iframe styling - centered with rounded corners */
iframe,
video,
.prose iframe,
.prose video,
article iframe,
article video {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  border-radius: 20px !important;
  overflow: hidden !important;
}

/* YouTube embed specific styling */
iframe[src*="youtube.com"],
iframe[src*="youtu.be"] {
  display: block !important;
  margin-left: auto !important;
  margin-right: auto !important;
  border-radius: 20px !important;
  max-width: 100% !important;
}

/* Ensure parent containers don't interfere */
.prose > iframe,
.prose > video {
  margin: 2rem auto !important;
}

/* Container for video embeds */
.video-container,
.video-wrapper {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  margin: 2rem 0 !important;
}

.video-container iframe,
.video-wrapper iframe {
  border-radius: 20px !important;
}
```

#### 2. **YouTubeEmbed Component** (`src/components/exercises/youtube-embed.tsx`)
Cập nhật từ 15px → 20px:

```tsx
// Container
rounded-[20px]  // Thay vì rounded-[15px]

// Inline style cho iframe
style={{ border: 0, borderRadius: '20px' }}
```

## 🎯 Kết Quả

### ✨ Tất Cả Video Bây Giờ:

1. **Căn Giữa Hoàn Hảo**
   - ✅ `margin-left: auto`
   - ✅ `margin-right: auto`
   - ✅ `display: block`
   - ✅ Flexbox centering trong containers

2. **Bo Góc 20px**
   - ✅ `border-radius: 20px`
   - ✅ `overflow: hidden` để bo góc hoạt động
   - ✅ Áp dụng cho cả iframe và container

3. **Responsive**
   - ✅ `max-width: 100%`
   - ✅ Aspect ratio 16:9
   - ✅ Shadow đẹp mắt

## 📍 Áp Dụng Cho

### ✅ Global (Tất Cả Trang)
- Bất kỳ `<iframe>` nào
- Bất kỳ `<video>` nào
- YouTube embeds
- Video embeds khác

### ✅ Exercise Pages
- Tất cả video trong bài tập
- Video trong markdown content
- Video trong `.prose` content

### ✅ Body Class Support
Hoạt động với:
```html
<body class="date-20251004 vi_VN ltr site-center-aligned site-as-giant-card webkit webkit-537">
```

## 🎨 Visual Example

```
┌─────────────────────────────────────┐
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║      YouTube Video        ║   │  ← Bo góc 20px
│   ║      Căn giữa trang      ║   │  ← Auto margin
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
└─────────────────────────────────────┘
        ↑ Container căn giữa
```

## 💡 Ưu Điểm

1. **Universal**: Áp dụng cho mọi video trên site
2. **Override-safe**: Sử dụng `!important` để đảm bảo
3. **Consistent**: Tất cả video đều có style giống nhau
4. **Maintainable**: Chỉ cần update CSS, không cần sửa components

## 🔍 Test Cases

### ✅ Đã Test:
- [x] YouTube iframe trong MDX
- [x] Video trong `.prose` content
- [x] Video trong exercise pages
- [x] Responsive trên mobile
- [x] Dark mode compatibility

## 📦 Files Changed

1. ✅ `src/app/globals.css` - Global video styling
2. ✅ `src/components/exercises/youtube-embed.tsx` - Component update

## 🚀 Usage

### Trong MDX:
```mdx
<iframe src="https://youtube.com/embed/..." />
```

### Trong Component:
```tsx
<YouTubeEmbed src="https://youtube.com/embed/..." />
```

### HTML Trực Tiếp:
```html
<iframe src="https://youtube.com/embed/..." />
```

**Tất cả đều tự động căn giữa và bo góc 20px!** ✨

---

**Updated**: 4 tháng 10, 2025  
**Border Radius**: 20px  
**Alignment**: Center  
**Status**: ✅ Complete
