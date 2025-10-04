#!/bin/bash
# Clean old Docusaurus imports from MDX files

echo "=== Cleaning old import statements from MDX files ==="

# Find all .mdx and .md files with import statements
files=$(find src/content -name "*.mdx" -o -name "*.md" | xargs grep -l "^import.*@site\|^import.*Quiz\|^import.*Exercise" 2>/dev/null)

count=0
for file in $files; do
  # Check if file actually has imports to clean
  if grep -q "^import.*@site\|^import.*from \"@site" "$file" 2>/dev/null; then
    echo "Cleaning: $file"
    # Remove lines starting with "import" that contain "@site" or Quiz/Exercise components
    sed -i.bak '/^import.*@site/d; /^import.*Quiz/d; /^import.*Exercise/d; /^import.*Comments/d' "$file"
    rm -f "${file}.bak"
    ((count++))
  fi
done

echo "=== Cleaned $count files ==="
