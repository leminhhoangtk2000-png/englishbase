#!/bin/bash

# Script to fix markdown rendering issues
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik

echo "Fixing markdown rendering issues..."

# Remove problematic admonition blocks and replace with simple formatting
for file in *.md; do
    if [[ -f "$file" ]]; then
        echo "Processing: $file"
        
        # Replace :::note blocks with simple **Note:** formatting
        sed -i '' 's/:::note\[.*\]/\*\*Lưu ý:\*\*/g' "$file"
        sed -i '' 's/:::note/\*\*Lưu ý:\*\*/g' "$file"
        sed -i '' '/^:::$/d' "$file"
        
        # Fix indented italic text
        sed -i '' 's/^  _\(.*\)_$/- \1/g' "$file"
        
        # Fix extra spaces at beginning of lines
        sed -i '' 's/^  \*\*/- \*\*/g' "$file"
        sed -i '' 's/^  -/- /g' "$file"
        
    fi
done

echo "Fixed all markdown files!"
