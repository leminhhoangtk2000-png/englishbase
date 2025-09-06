# 🚀 QUY TRÌNH AUTO-SAVE & HOT RELOAD 

## Bước 1: Cấu hình VS Code Auto-Save

1. **Mở VS Code Settings (⌘ + ,)**
2. **Bật Auto Save:**
   - Tìm `files.autoSave`
   - Chọn `afterDelay` 
   - Set `files.autoSaveDelay` = 1000ms

✅ **Hoặc dùng file .vscode/settings.json đã được tạo**

## Bước 2: Quy trình Edit-Save-Reload

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch content changes (optional)
npm run watch:content
```

## Bước 3: Workflow cho mỗi file markdown

### ✅ **QUI TẮC QUAN TRỌNG:**

1. **File naming:** `[order]-[name].md`
   - ✅ Đúng: `03-wfragen.md`
   - ❌ Sai: `3.  Wfragen und JaNein-Fragen.md`

2. **Frontmatter bắt buộc:**
```yaml
---
title: "Tiêu đề bài học"
description: "Mô tả chi tiết"
level: "A1"
topic: "Grammatik"
order: 3
---
```

3. **Admonition syntax:**
```markdown
:::note
Ghi chú quan trọng
:::

:::tip[Mẹo học tập]
Nội dung mẹo
:::
```

## Bước 4: Auto-Sync Navigation

**Khi thêm file mới:**

1. Tạo file `.md` trong `src/content/a1niveau/grammatik/`
2. Cập nhật `src/config/a1niveau.ts`:

```typescript
{
  title: "Tên bài học",
  description: "Mô tả",
  href: "/a1niveau/grammatik/filename",
}
```

3. **Save file** → Next.js tự động reload

## Bước 5: Debugging

```bash
# Kiểm tra server status
lsof -i :9003

# Restart server nếu cần
npm run dev:clean

# Watch file changes
./auto-save-reload.sh
```

## 📝 **WORKFLOW THỰC HÀNH:**

1. **Edit file markdown** → VS Code auto-save sau 1 giây
2. **Next.js detect changes** → Auto reload browser
3. **Check tại**: http://localhost:9003
4. **Nếu có lỗi**: Check terminal output

## 🎯 **LỢI ÍCH:**

✅ **Real-time preview** - Thấy thay đổi ngay lập tức  
✅ **Auto-format** - Code tự động được format  
✅ **Error detection** - Báo lỗi syntax ngay  
✅ **Hot reload** - Không cần refresh manual  

## 🔧 **SCRIPT UTILITIES:**

```bash
# Auto-save watcher
npm run auto-save

# Clean restart
npm run dev:clean

# Content watcher
npm run watch:content
```

---
**📅 Tạo ngày: $(date)**  
**🎯 Mục tiêu: Real-time development cho German learning platform**
