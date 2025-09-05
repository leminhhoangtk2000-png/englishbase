---
title: "Demo: Docusaurus-Style Markdown Features"
description: "Minh họa tất cả tính năng markdown nâng cao như Docusaurus"
date: "2024-01-10"
author: "Deutsch Lernen"
tags: ["demo", "features", "markdown"]
level: "A1"
order: 10
slug: "demo-docusaurus-features"
---

# Demo: Docusaurus-Style Markdown Features

Trang này minh họa tất cả các tính năng markdown nâng cao tương tự như Docusaurus.

## 🎯 Admonitions (Callouts) với nhiều loại

:::note[Thông tin cơ bản]
Đây là admonition loại **note** với tiêu đề tùy chỉnh và có thể chứa *markdown* và `code`.
:::

:::tip[Mẹo học tập hiệu quả]
Sử dụng **flashcards** và thực hành **speaking** mỗi ngày để cải thiện nhanh chóng.
:::

:::important[Quan trọng phải nhớ]
Ngữ pháp tiếng Đức có **4 Kasus**: Nominativ, Akkusativ, Dativ, Genitiv.
:::

:::warning[Cảnh báo phổ biến]
Đừng nhầm lẫn giữa **der/die/das** - đây là lỗi sai phổ biến nhất của người học.
:::

:::caution[Thận trọng khi sử dụng]
Một số từ trong tiếng Đức có nghĩa hoàn toàn khác với tiếng Anh dù viết giống nhau.
:::

:::danger[Nguy hiểm - Tránh lỗi này]
**Không bao giờ** dịch từng từ một từ tiếng Việt sang tiếng Đức. Điều này sẽ tạo ra câu sai ngữ pháp.
:::

## 💻 Enhanced Code Blocks

### Basic Code Block với Syntax Highlighting

```javascript
function greetInGerman(name) {
  const greetings = ['Hallo', 'Guten Tag', 'Guten Morgen'];
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  return `${randomGreeting}, ${name}!`;
}

console.log(greetInGerman('Maria')); // Output: "Hallo, Maria!"
```

### Code Block với Title

```python title="german_vocabulary_trainer.py"
class GermanVocabularyTrainer:
    def __init__(self):
        self.vocabulary = {
            'der Hund': 'con chó',
            'die Katze': 'con mèo', 
            'das Haus': 'ngôi nhà'
        }
    
    def quiz(self, german_word):
        return self.vocabulary.get(german_word, 'Không tìm thấy')

trainer = GermanVocabularyTrainer()
print(trainer.quiz('der Hund'))  # Output: con chó
```

### Code Block với Line Numbers

```java showLineNumbers title="GermanGrammar.java"
public class GermanGrammar {
    private String[] articles = {"der", "die", "das"};
    
    public String getArticle(String noun) {
        // Logic để xác định mạo từ dựa trên quy tắc
        if (noun.endsWith("ung") || noun.endsWith("heit")) {
            return "die";  // Hầu hết danh từ kết thúc -ung, -heit là feminine
        }
        return "der"; // Default fallback
    }
    
    public static void main(String[] args) {
        GermanGrammar grammar = new GermanGrammar();
        System.out.println(grammar.getArticle("Wohnung")); // Output: die
    }
}
```

### Code Block với Line Highlighting

```typescript {3,5-7,10} title="german-learning-app.ts"
interface GermanWord {
  german: string;
  vietnamese: string;  // Highlighted line
  category: 'noun' | 'verb' | 'adjective';
  examples: string[];  // Start of highlighted range
  difficulty: 1 | 2 | 3 | 4 | 5;
  gender?: 'der' | 'die' | 'das';  // End of highlighted range
}

const words: GermanWord[] = [
  {  // This line is highlighted
    german: 'das Buch',
    vietnamese: 'cuốn sách',
    category: 'noun',
    examples: ['Ich lese ein Buch', 'Das Buch ist interessant'],
    difficulty: 1,
    gender: 'das'
  }
];
```

## 📊 Enhanced Tables

| Artikel | Beispiel | Vietnamesisch | Kasus | Verwendung |
|---------|----------|---------------|-------|------------|
| **der** | der Mann | người đàn ông | Nom. | Subjekt |
| **die** | die Frau | người phụ nữ | Nom. | Subjekt |  
| **das** | das Kind | đứa trẻ | Nom. | Subjekt |
| **den** | den Mann | người đàn ông | Akk. | Direktes Objekt |
| **der** | der Frau | người phụ nữ | Dat. | Indirektes Objekt |

## 🔄 Multi-Language Tabs

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="programming-examples">
<TabItem value="js" label="JavaScript">

```javascript
// German vocabulary checker
function checkGender(word) {
  const feminineEndings = ['ung', 'heit', 'keit', 'schaft'];
  const masculineEndings = ['er', 'ig', 'ling'];
  const neuterEndings = ['chen', 'lein', 'tum'];
  
  for (let ending of feminineEndings) {
    if (word.endsWith(ending)) return 'die';
  }
  
  return 'unknown';
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
def check_gender(word):
    """Kiểm tra giới tính của danh từ tiếng Đức"""
    feminine_endings = ['ung', 'heit', 'keit', 'schaft']
    masculine_endings = ['er', 'ig', 'ling'] 
    neuter_endings = ['chen', 'lein', 'tum']
    
    for ending in feminine_endings:
        if word.endswith(ending):
            return 'die'
    
    return 'unknown'
```

</TabItem>
<TabItem value="java" label="Java">

```java
public class GenderChecker {
    private static final String[] FEMININE_ENDINGS = {"ung", "heit", "keit", "schaft"};
    
    public static String checkGender(String word) {
        for (String ending : FEMININE_ENDINGS) {
            if (word.endsWith(ending)) {
                return "die";
            }
        }
        return "unknown";
    }
}
```

</TabItem>
</Tabs>

## 🧮 Math Equations Support

### Inline Math
Trong tiếng Đức, tỷ lệ sử dụng các mạo từ là: $\frac{\text{der}}{\text{die}} \approx 1.2$ và tổng số từ vựng cần học ở level A1 là khoảng $n = 2000$ từ.

### Display Math (Block)
Công thức tính thời gian học để đạt level B2:

$$
T = \frac{V \times D \times L}{S \times M}
$$

Trong đó:
- $T$ = Thời gian (giờ)  
- $V$ = Số từ vựng cần học
- $D$ = Độ khó trung bình (1-5)
- $L$ = Số level cần đạt
- $S$ = Tốc độ học (từ/giờ)
- $M$ = Hệ số ghi nhớ (0.1-1.0)

## 🔍 Details/Summary Elements

<details>
<summary>📚 **Từ vựng nâng cao về gia đình**</summary>

**Immediate Family:**
- der Vater / der Papa - bố
- die Mutter / die Mama - mẹ  
- der Sohn - con trai
- die Tochter - con gái

**Extended Family:**
- der Großvater / der Opa - ông
- die Großmutter / die Oma - bà
- der Onkel - chú/bác/cậu
- die Tante - cô/dì/thím

<details>
<summary>💡 **Mẹo ghi nhớ các từ này**</summary>

1. **Sử dụng flashcards** với hình ảnh gia đình
2. **Tạo family tree** bằng tiếng Đức  
3. **Luyện tập** bằng cách mô tả gia đình bạn
4. **Xem phim** tiếng Đức về chủ đề gia đình

</details>

</details>

## 🎨 Enhanced Blockquotes

> **Albert Einstein đã nói:**
> 
> "Ich habe keine besondere Begabung, sondern bin nur leidenschaftlich neugierig."
> 
> *(Tôi không có tài năng đặc biệt, mà chỉ có sự tò mò say mê.)*
> 
> — Đây là động lực tuyệt vời để học tiếng Đức!

## 🏗️ Nested Admonitions

:::::important[Cấu trúc câu tiếng Đức]
Câu tiếng Đức có cấu trúc rất rõ ràng và logic:

::::tip[Quy tắc vị trí động từ]
Trong câu đơn:
:::note[Vị trí thứ 2]
Động từ chia luôn ở **vị trí thứ 2** trong câu khẳng định.

**Ví dụ:** Ich **lerne** jeden Tag Deutsch.
:::

Trong câu phụ:
:::warning[Động từ cuối câu]
Động từ chia đi xuống **cuối câu phụ**.

**Ví dụ:** Ich weiß, dass du Deutsch **lernst**.
:::
::::

:::::

## 🎯 Summary & Next Steps

Với tất cả các tính năng markdown nâng cao này, website của bạn giờ đây có thể:

✅ **Hiển thị code đẹp** với syntax highlighting và line numbers  
✅ **Admonitions đa dạng** cho các loại thông tin khác nhau  
✅ **Tabs tương tác** để so sánh nội dung  
✅ **Math equations** cho các công thức phức tạp  
✅ **Tables responsive** hiển thị đẹp trên mọi thiết bị  
✅ **Details/Summary** cho nội dung có thể mở rộng  

:::tip[Bước tiếp theo]
Hãy sử dụng những tính năng này để tạo ra nội dung học tiếng Đức phong phú và hấp dẫn hơn!
:::
