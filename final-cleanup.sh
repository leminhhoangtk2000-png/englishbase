#!/bin/bash

# Final cleanup script for all markdown files
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/a1niveau/grammatik

echo "🧹 Final cleanup for all markdown files..."

for file in *.md; do
    if [[ -f "$file" ]]; then
        echo "🔧 Processing: $file"
        
        # Fix all indented italic text patterns
        sed -i '' 's/^\t_\(.*\)_$/ _\1_/g' "$file"
        
        # Fix tab-indented content to simple format
        sed -i '' 's/^\t\(.*\)$/\1/g' "$file"
        
        # Remove excessive line breaks
        sed -i '' '/^$/N;/^\n$/d' "$file"
        
        # Fix emoji patterns that might cause issues
        sed -i '' 's/📌 \*\*Mẹo/\*\*Mẹo/g' "$file"
        sed -i '' 's/💡 Mẹo/\*\*Mẹo/g' "$file"
        
        # Clean up double spaces
        sed -i '' 's/  \+/ /g' "$file"
        
    fi
done

echo "✅ All files processed!"
echo "📝 Final check - files with potential issues:"
grep -l "^\t" *.md 2>/dev/null || echo "No tab-indented content found"
grep -l "  _.*_" *.md 2>/dev/null || echo "No indented italic content found"
