# Hướng dẫn sử dụng Admonitions (Callouts)

Hệ thống markdown của Edu-theme hỗ trợ admonitions (còn gọi là callouts) để làm nổi bật thông tin quan trọng và tăng tính tương tác của nội dung.

## Cú pháp cơ bản

```markdown
:::type Tiêu đề tùy chọn
Nội dung của admonition
:::
```

## Các loại admonitions có sẵn

### 1. Note (Ghi chú) - Màu xanh dương
```markdown
:::note Ghi chú
Dùng để cung cấp thông tin bổ sung hoặc giải thích thêm.
:::
```

### 2. Tip (Mẹo) - Màu xanh lá
```markdown
:::tip Mẹo hữu ích
Dùng để chia sẻ các tricks, best practices, hoặc lời khuyên hữu ích.
:::
```

### 3. Important (Quan trọng) - Màu tím
```markdown
:::important Quan trọng
Dùng để nhấn mạnh thông tin cực kỳ quan trọng mà người đọc cần chú ý.
:::
```

### 4. Warning (Cảnh báo) - Màu cam
```markdown
:::warning Cảnh báo
Dùng để cảnh báo về điều gì đó có thể gây vấn đề nếu không cẩn thận.
:::
```

### 5. Caution (Thận trọng) - Màu vàng
```markdown
:::caution Thận trọng
Dùng để nhắc nhở cần thận trọng khi thực hiện một hành động.
:::
```

### 6. Danger (Nguy hiểm) - Màu đỏ
```markdown
:::danger Nguy hiểm
Dùng để cảnh báo về điều gì đó có thể gây hại nghiêm trọng.
:::
```

## Tính năng nâng cao

### Nội dung phức tạp
Admonitions có thể chứa markdown phức tạp như lists, code blocks, tables:

```markdown
:::tip Học từ vựng hiệu quả
Để học từ vựng tiếng Đức hiệu quả:

1. **Học theo chủ đề**: Nhóm các từ có liên quan
2. **Sử dụng flashcards**: Dùng Anki hoặc Quizlet
3. **Luyện tập hàng ngày**: 15-20 phút mỗi ngày

```javascript
const vocabulary = {
  deutsch: "Hallo",
  vietnamese: "Xin chào"
}
```
:::
```

### Không có tiêu đề
```markdown
:::note
Admonition này không có tiêu đề tùy chỉnh.
:::
```

## Styling và themes

Hệ thống tự động hỗ trợ dark mode và light mode:
- **Light mode**: Nền sáng với màu sắc tương ứng
- **Dark mode**: Nền tối với màu sắc được điều chỉnh cho dễ đọc

## Ví dụ thực tế

Xem file `/content/a1niveau/test/admonitions-demo.md` để thấy tất cả các loại admonitions hoạt động.

## Best practices

1. **Sử dụng đúng loại**: Chọn loại admonition phù hợp với nội dung
2. **Tiêu đề ngắn gọn**: Tiêu đề nên ngắn và có ý nghĩa
3. **Nội dung rõ ràng**: Viết nội dung dễ hiểu và súc tích
4. **Không lạm dụng**: Không nên dùng quá nhiều trong một trang
5. **Sắp xếp hợp lý**: Đặt admonitions ở vị trí phù hợp trong luồng nội dung
