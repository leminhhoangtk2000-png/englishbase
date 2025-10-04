#!/bin/bash

# Script to add ExerciseComments import to files that need it
echo "🔧 Adding ExerciseComments import statements..."
echo ""

count=0

for file in src/content/exercises/a2/**/*.mdx src/content/exercises/b1/**/*.mdx; do
  if [ -f "$file" ]; then
    # Check if file has ExerciseComments component but no import
    if grep -q "ExerciseComments" "$file" && ! grep -q "import.*ExerciseComments" "$file"; then
      # Find the line number after the frontmatter (after the second ---)
      frontmatter_end=$(grep -n "^---$" "$file" | sed -n '2p' | cut -d: -f1)
      
      if [ -n "$frontmatter_end" ]; then
        # Add import statement after frontmatter
        import_line=$((frontmatter_end + 2))
        sed -i '' "${import_line}i\\
import { ExerciseComments } from '@/components/exercises/ExerciseComments';\\
" "$file"
        
        echo "✅ Added import to: $(basename "$file")"
        count=$((count + 1))
      fi
    fi
  fi
done

echo ""
echo "✅ Complete! Added import to $count files"
