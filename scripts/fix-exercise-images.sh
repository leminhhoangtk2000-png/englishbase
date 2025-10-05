#!/bin/bash

# Script to update image paths in exercise MDX files
# From: img/blog/filename.png
# To: /excersises/filename.png

echo "🔍 Tìm tất cả file MDX trong exercises..."

# Count total files
total=$(find src/content/exercises -name "*.mdx" -type f | wc -l | tr -d ' ')
echo "📊 Tổng số file: $total"

# Find and update all MDX files
counter=0
find src/content/exercises -name "*.mdx" -type f | while read file; do
  counter=$((counter + 1))
  
  # Check if file contains the old path
  if grep -q "image: img/blog/" "$file"; then
    echo "📝 [$counter/$total] Updating: $file"
    
    # Replace img/blog/ with /excersises/
    sed -i '' 's|image: img/blog/|image: /excersises/|g' "$file"
    
    echo "   ✅ Updated"
  else
    echo "⏭️  [$counter/$total] Skipping (no changes needed): $file"
  fi
done

echo ""
echo "🎉 Hoàn thành!"
echo ""
echo "📋 Kiểm tra kết quả:"
echo "   grep -r 'image: /excersises/' src/content/exercises | wc -l"
echo ""
echo "🔍 Xem các file đã thay đổi:"
echo "   git diff src/content/exercises"
