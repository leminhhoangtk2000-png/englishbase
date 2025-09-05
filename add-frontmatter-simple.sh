#!/bin/bash

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik"

# Function to add frontmatter if missing
add_frontmatter() {
    local file="$1"
    local title="$2"
    local description="$3"
    local order="$4"
    
    # Check if file starts with ---
    if ! head -n 1 "$file" | grep -q "^---"; then
        # Create temp file with frontmatter
        cat > temp << EOF
---
title: "$title"
description: "$description"
level: "A1"
topic: "Grammatik"
order: $order
---

EOF
        # Append original content
        cat "$file" >> temp
        mv temp "$file"
        echo "Added frontmatter to $file"
    fi
}

# Process each file individually
if [ -f "06-trennbare-verben.md" ]; then
    add_frontmatter "06-trennbare-verben.md" "Trennbare Verben - Động từ tách được" "Học về động từ tách được và không tách được trong tiếng Đức" "6"
fi

if [ -f "07-imperativ.md" ]; then
    add_frontmatter "07-imperativ.md" "Imperativ - Câu mệnh lệnh" "Tìm hiểu cách tạo và sử dụng câu mệnh lệnh (Imperativ) trong tiếng Đức" "7"
fi

if [ -f "08-prapositionen.md" ]; then
    add_frontmatter "08-prapositionen.md" "Präpositionen - Giới từ" "Học về giới từ trong tiếng Đức và cách sử dụng với các Kasus khác nhau" "8"
fi

if [ -f "09-negation.md" ]; then
    add_frontmatter "09-negation.md" "Negation - Phủ định với nicht và kein" "Tìm hiểu cách phủ định trong tiếng Đức với nicht và kein" "9"
fi

if [ -f "10-konjunktionen.md" ]; then
    add_frontmatter "10-konjunktionen.md" "Konjunktionen - Liên từ" "Học về các liên từ kết nối mệnh đề trong tiếng Đức" "10"
fi

if [ -f "11-quan-tu-nang-cao.md" ]; then
    add_frontmatter "11-quan-tu-nang-cao.md" "Quán từ nâng cao - Erweiterter Wortschatz" "Mở rộng kiến thức về quán từ và từ vựng nâng cao trong tiếng Đức" "11"
fi

if [ -f "12-personalpronomen.md" ]; then
    add_frontmatter "12-personalpronomen.md" "Personalpronomen - Đại từ nhân xưng" "Tìm hiểu về đại từ nhân xưng trong tiếng Đức và cách chia theo các Kasus" "12"
fi

echo "✅ Completed adding frontmatter to all files!"
