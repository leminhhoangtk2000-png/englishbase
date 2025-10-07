#!/bin/bash

# Script to fix image paths in exercise MDX files
# Change /img/blog/ to /excersises/

echo "🔧 Fixing image paths in exercise MDX files..."

# Find all MDX files with /img/blog/ and replace with /excersises/
find src/content/exercises -name "*.mdx" -exec sed -i '' 's|/img/blog/|/excersises/|g' {} \;

echo "✅ Fixed image paths from /img/blog/ to /excersises/"

# Also check if there are any remaining issues
echo "🔍 Checking for remaining /img/blog/ references..."
grep -r "/img/blog/" src/content/exercises/ || echo "✅ No remaining /img/blog/ references found!"

echo "🎯 Image path fix completed!"
