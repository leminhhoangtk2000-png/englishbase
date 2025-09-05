#!/bin/bash

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik"

# Fix 02-artikel-nomen.md - remove leading empty line
if [ -f "02-artikel-nomen.md" ]; then
    tail -n +2 "02-artikel-nomen.md" > temp && mv temp "02-artikel-nomen.md"
fi

# Fix 03-w-fragen.md - completely corrupted, recreate frontmatter
if [ -f "03-w-fragen.md" ]; then
    cat > temp << 'EOF'
---
title: "W-Fragen und Ja/Nein-Fragen"
description: "Học cách đặt câu hỏi trong tiếng Đức với W-Fragen và Ja/Nein-Fragen"
level: "A1"
topic: "Grammatik" 
order: 3
---

Trong tiếng Đức, câu hỏi được chia thành hai loại chính: **W-Fragen** (câu hỏi với từ đặt câu hỏi) và **Ja/Nein-Fragen** (câu hỏi có/không). Cùng tìm hiểu chi tiết dưới đây!

---

## **1. W-Fragen (Câu hỏi với từ đặt câu hỏi)**

W-Fragen bắt đầu bằng các từ đặt câu hỏi bắt đầu bằng chữ "W" (z.B.: Was, Wo, Wer, Wann, Warum).

:::tip[📌 Cấu trúc chung]
**W-Frage + Động từ chia + Chủ ngữ + (Phần còn lại)**
:::

EOF
    # Extract content after the corrupted frontmatter (skip first broken lines)
    sed -n '10,$p' "03-w-fragen.md" | grep -v "^title:" | grep -v "^description:" >> temp
    mv temp "03-w-fragen.md"
fi

# Fix 04-kasus.md - remove leading empty line
if [ -f "04-kasus.md" ]; then
    tail -n +2 "04-kasus.md" > temp && mv temp "04-kasus.md"
fi

# Check other files for leading empty lines and fix them
for file in *.md; do
    if [ "$file" != "index.md" ] && [ -f "$file" ]; then
        # Check if first line is empty
        if [ "$(head -n 1 "$file")" = "" ]; then
            tail -n +2 "$file" > temp && mv temp "$file"
            echo "Fixed leading empty line in $file"
        fi
    fi
done

echo "✅ Fixed all frontmatter issues!"
