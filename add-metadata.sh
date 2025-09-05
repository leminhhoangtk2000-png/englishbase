#!/bin/bash

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik"

# File 5: Modalverben
if [ -f "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md" ]; then
    if ! grep -q "^---" "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Modalverben - Động từ khuyết thiếu"
description: "Tìm hiểu về các động từ khuyết thiếu (Modalverben) trong tiếng Đức: können, müssen, wollen, sollen, dürfen, mögen"
level: "A1"
topic: "Grammatik"
order: 5
---

EOF
        cat "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md" >> "$temp_file"
        mv "$temp_file" "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md"
    fi
fi

# File 6: Trennbare Verben
if [ -f "6. Trennbare Verben - Động từ tách được và không tách được.md" ]; then
    if ! grep -q "^---" "6. Trennbare Verben - Động từ tách được và không tách được.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Trennbare Verben - Động từ tách được"
description: "Học về động từ tách được và không tách được trong tiếng Đức"
level: "A1"
topic: "Grammatik"
order: 6
---

EOF
        cat "6. Trennbare Verben - Động từ tách được và không tách được.md" >> "$temp_file"
        mv "$temp_file" "6. Trennbare Verben - Động từ tách được và không tách được.md"
    fi
fi

# File 7: Imperativ
if [ -f "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md" ]; then
    if ! grep -q "^---" "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Imperativ - Câu mệnh lệnh"
description: "Tìm hiểu cách tạo và sử dụng câu mệnh lệnh (Imperativ) trong tiếng Đức"
level: "A1"
topic: "Grammatik"
order: 7
---

EOF
        cat "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md" >> "$temp_file"
        mv "$temp_file" "7. Imperativ - Câu mệnh lệnh trong tiếng Đức.md"
    fi
fi

# File 8: Präpositionen
if [ -f "8. Präpositionen - Giới từ trong tiếng Đức.md" ]; then
    if ! grep -q "^---" "8. Präpositionen - Giới từ trong tiếng Đức.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Präpositionen - Giới từ"
description: "Học về giới từ trong tiếng Đức và cách sử dụng với các Kasus khác nhau"
level: "A1"
topic: "Grammatik"
order: 8
---

EOF
        cat "8. Präpositionen - Giới từ trong tiếng Đức.md" >> "$temp_file"
        mv "$temp_file" "8. Präpositionen - Giới từ trong tiếng Đức.md"
    fi
fi

# File 9: Negation
if [ -f "9. Negation mit nicht und kein.md" ]; then
    if ! grep -q "^---" "9. Negation mit nicht und kein.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Negation - Phủ định với nicht và kein"
description: "Tìm hiểu cách phủ định trong tiếng Đức với nicht và kein"
level: "A1"
topic: "Grammatik"
order: 9
---

EOF
        cat "9. Negation mit nicht und kein.md" >> "$temp_file"
        mv "$temp_file" "9. Negation mit nicht und kein.md"
    fi
fi

# File 10: Konjunktionen
if [ -f "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md" ]; then
    if ! grep -q "^---" "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Konjunktionen - Liên từ"
description: "Học về các liên từ kết nối mệnh đề trong tiếng Đức"
level: "A1"
topic: "Grammatik"
order: 10
---

EOF
        cat "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md" >> "$temp_file"
        mv "$temp_file" "10. Konjunktionen - Liên kết mệnh đề chính trong tiếng Đức.md"
    fi
fi

# File 11: Quán từ nâng cao
if [ -f "11. Quán Từ nâng cao - Erweiterter Wortschatz.md" ]; then
    if ! grep -q "^---" "11. Quán Từ nâng cao - Erweiterter Wortschatz.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Quán từ nâng cao - Erweiterter Wortschatz"
description: "Mở rộng kiến thức về quán từ và từ vựng nâng cao trong tiếng Đức"
level: "A1"
topic: "Grammatik"
order: 11
---

EOF
        cat "11. Quán Từ nâng cao - Erweiterter Wortschatz.md" >> "$temp_file"
        mv "$temp_file" "11. Quán Từ nâng cao - Erweiterter Wortschatz.md"
    fi
fi

# File 12: Personalpronomen
if [ -f "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md" ]; then
    if ! grep -q "^---" "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md"; then
        temp_file=$(mktemp)
        cat > "$temp_file" << 'EOF'
---
title: "Personalpronomen - Đại từ nhân xưng"
description: "Tìm hiểu về đại từ nhân xưng trong tiếng Đức và cách chia theo các Kasus"
level: "A1"
topic: "Grammatik"
order: 12
---

EOF
        cat "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md" >> "$temp_file"
        mv "$temp_file" "12. Personalpronomen - Đại từ nhân xưng trong tiếng Đức.md"
    fi
fi

echo "✅ Đã thêm metadata cho tất cả các file!"
