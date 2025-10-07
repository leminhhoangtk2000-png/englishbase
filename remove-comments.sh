#!/bin/bash

# Script to remove all ExerciseComments imports and usage from MDX files

echo "Removing ExerciseComments from MDX files..."

# Find all MDX files containing ExerciseComments import
find src/content -name "*.mdx" -exec grep -l "import ExerciseComments" {} \; | while read file; do
    echo "Processing: $file"
    
    # Remove import line
    sed -i '' '/import ExerciseComments from/d' "$file"
    
    # Remove ExerciseComments component usage (including multiline)
    # This removes from <ExerciseComments to the closing />
    sed -i '' '/<ExerciseComments/,/\/>/d' "$file"
    
    echo "  - Removed ExerciseComments from $file"
done

# Also remove from mdx-components-renderer.tsx
if [ -f "src/components/mdx-components-renderer.tsx" ]; then
    echo "Processing: src/components/mdx-components-renderer.tsx"
    sed -i '' '/import ExerciseComments from/d' "src/components/mdx-components-renderer.tsx"
    sed -i '' '/ExerciseComments,/d' "src/components/mdx-components-renderer.tsx"
    echo "  - Removed ExerciseComments from mdx-components-renderer.tsx"
fi

echo "Done!"
