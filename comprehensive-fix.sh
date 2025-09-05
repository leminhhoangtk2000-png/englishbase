#!/bin/bash

# Comprehensive fix for all markdown issues
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik

echo "🔧 Comprehensive markdown fix..."

# 1. Remove all duplicate files
echo "📁 Removing duplicate files..."
rm -f "1. Chia động từ ở thì hiện tại - Präsens.md" 2>/dev/null
rm -f "2. Artikel und Nomen - Khái niệm về Quán từ.md" 2>/dev/null
rm -f "3.  Wfragen und JaNein-Fragen.md" 2>/dev/null
rm -f "4. Nomi - Akku - Dativ.md" 2>/dev/null
rm -f "5. Modalverben - Động từ khuyết thiếu trong tiếng Đức.md" 2>/dev/null
rm -f "6. Trennbare Verben - Động từ tách được và không tách được.md" 2>/dev/null
rm -f "test-render.md" 2>/dev/null

# 2. Fix all admonition blocks
echo "📝 Fixing admonition blocks..."
for file in *.md; do
    if [[ -f "$file" ]]; then
        echo "Processing: $file"
        
        # Fix all types of admonition blocks
        sed -i '' 's/:::note\[.*\]/\*\*Lưu ý:\*\*/g' "$file"
        sed -i '' 's/:::note/\*\*Lưu ý:\*\*/g' "$file"
        sed -i '' 's/:::info\[.*\]/\*\*Thông tin:\*\*/g' "$file"
        sed -i '' 's/:::info/\*\*Thông tin:\*\*/g' "$file"
        sed -i '' 's/:::warning\[.*\]/\*\*Cảnh báo:\*\*/g' "$file"
        sed -i '' 's/:::warning/\*\*Cảnh báo:\*\*/g' "$file"
        sed -i '' '/^:::$/d' "$file"
        
        # Fix indented italic text
        sed -i '' 's/^  _\(.*\)_$/- \1/g' "$file"
        
        # Fix indented bullet points
        sed -i '' 's/^  \*\*/- \*\*/g' "$file"
        sed -i '' 's/^  -/- /g' "$file"
        
        # Fix indented lines that should be bullet points
        sed -i '' 's/^  \([^-_*]\)/- \1/g' "$file"
        
    fi
done

echo "✅ All markdown files fixed!"
echo "📊 Files remaining:"
ls -1 *.md | wc -l
echo "📋 Current files:"
ls -1 *.md
