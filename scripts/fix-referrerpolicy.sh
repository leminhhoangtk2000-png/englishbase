#!/bin/bash

echo "🔧 Fixing referrerpolicy -> referrerPolicy in MDX files..."

# Find and replace all occurrences
find src/content/exercises -name "*.mdx" -type f -exec sed -i '' 's/referrerpolicy="/referrerPolicy="/g' {} \;

echo "✅ Done! Checking results..."

# Count remaining issues
count=$(grep -r "referrerpolicy" src/content/exercises --include="*.mdx" 2>/dev/null | wc -l)
echo "Remaining issues: $count"

if [ "$count" -eq 0 ]; then
    echo "✨ All referrerpolicy issues fixed!"
else
    echo "⚠️  Still have $count issues to fix"
fi
