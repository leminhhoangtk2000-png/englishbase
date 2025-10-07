#!/bin/bash

echo "🔧 Fixing allowfullscreen -> allowFullScreen in MDX files..."

# Find and replace allowfullscreen with allowFullScreen in all .mdx files
find src/content -name "*.mdx" -type f -exec sed -i '' 's/allowfullscreen/allowFullScreen/g' {} +

echo "✅ Fixed allowfullscreen in all MDX files"

# Count how many files were affected
count=$(grep -r "allowFullScreen" src/content --include="*.mdx" | wc -l)
echo "📊 Total iframe instances with allowFullScreen: $count"
