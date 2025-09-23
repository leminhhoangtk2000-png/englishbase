# German Example List Component - Hướng dẫn sử dụng

## Tổng quan

Component `GermanExampleList` được thiết kế để hiển thị danh sách các ví dụ tiếng Đức với bản dịch tiếng Việt, tương tự như style trong VS Code với syntax highlighting.

## Cách sử dụng trong Markdown (.md files)

```jsx
<GermanExampleList
  title="Ví dụ với 'dass' và 'ob'"
  examples={[
    {
      german: "Ich denke, dass Deutsch schwierig ist.",
      vietnamese: "Tôi nghĩ rằng tiếng Đức khó.",
      highlight: "dass",
    },
    {
      german: "Ich weiß nicht, ob er kommt.",
      vietnamese: "Tôi không biết liệu anh ấy có đến hay không.",
      highlight: "ob",
    },
  ]}
/>
```

## Props

### `title` (optional)

- **Type**: `string`
- **Mô tả**: Tiêu đề cho danh sách ví dụ
- **Ví dụ**: `"Ví dụ với 'dass' và 'ob'"`

### `examples` (required)

- **Type**: `ExampleItem[]`
- **Mô tả**: Mảng các ví dụ tiếng Đức

#### ExampleItem Properties:

- **`german`** (required): Câu tiếng Đức
- **`vietnamese`** (required): Bản dịch tiếng Việt
- **`highlight`** (optional): Từ hoặc cụm từ cần highlight (màu vàng)

### `className` (optional)

- **Type**: `string`
- **Mô tả**: CSS classes bổ sung
- **Default**: `''`

## Tính năng

### 1. Highlighting

- Tự động highlight từ khóa quan trọng
- Màu nền vàng cho từ được highlight
- Hỗ trợ cả light và dark mode

### 2. Responsive Design

- Tự động adapt với màn hình mobile
- Border trái màu xanh để dễ nhận biết
- Spacing hợp lý giữa các ví dụ

### 3. Dark Mode Support

- Tự động thay đổi màu theo theme
- Contrast tốt trong cả hai chế độ

## Ví dụ thực tế

### Ví dụ cơ bản (không highlight)

```jsx
<GermanExampleList
  examples={[
    {
      german: "Ich gehe nach Hause.",
      vietnamese: "Tôi về nhà.",
    },
  ]}
/>
```

### Ví dụ với tiêu đề và highlight

```jsx
<GermanExampleList
  title="Câu điều kiện với 'wenn'"
  examples={[
    {
      german: "Wenn es regnet, bleibe ich zu Hause.",
      vietnamese: "Nếu trời mưa, tôi ở nhà.",
      highlight: "wenn",
    },
    {
      german: "Ich nehme einen Regenschirm, wenn es regnet.",
      vietnamese: "Tôi mang ô nếu trời mưa.",
      highlight: "wenn",
    },
  ]}
/>
```

### Ví dụ phức tạp

```jsx
<GermanExampleList
  title="Các loại mệnh đề phụ"
  examples={[
    {
      german: "Ich bleibe zu Hause, weil ich krank bin.",
      vietnamese: "Tôi ở nhà vì tôi bị bệnh.",
      highlight: "weil",
    },
    {
      german: "Sie lernt viel, damit sie die Prüfung besteht.",
      vietnamese: "Cô ấy học nhiều để đỗ kỳ thi.",
      highlight: "damit",
    },
    {
      german: "Er sagt, dass er morgen kommt.",
      vietnamese: "Anh ấy nói rằng anh ấy sẽ đến ngày mai.",
      highlight: "dass",
    },
  ]}
/>
```

## CSS Classes được sử dụng

- `.border-l-4`: Border trái dày
- `.border-blue-400`: Màu border xanh
- `.bg-gray-50`: Background sáng
- `.dark:bg-gray-800`: Background tối cho dark mode
- `.bg-yellow-200`: Background highlight sáng
- `.dark:bg-yellow-700`: Background highlight tối

## Best Practices

1. **Sử dụng highlight có chủ đích**: Chỉ highlight từ khóa quan trọng cần học
2. **Nhóm ví dụ theo chủ đề**: Dùng `title` để phân loại rõ ràng
3. **Dịch nghĩa chính xác**: Vietnamese translation phải tự nhiên và dễ hiểu
4. **Không quá nhiều ví dụ**: 3-5 ví dụ mỗi component để tránh choáng ngợp

## Customization

Nếu cần style khác, có thể truyền `className`:

```jsx
<GermanExampleList
  className="border-2 border-red-300 bg-red-50"
  examples={[...]}
/>
```

## Integration

Component đã được tích hợp sẵn vào `mdx-components.tsx`, có thể sử dụng trực tiếp trong tất cả các file `.md` mà không cần import.
