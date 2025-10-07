#!/bin/bash

# Script to remove all ExerciseComments imports from MDX files

echo "Removing all ExerciseComments imports from MDX files..."

# Remove ExerciseComments imports from all MDX files
find src/content -name "*.mdx" -type f -exec sed -i '' '/import.*ExerciseComments/d' {} \;

echo "Completed removing ExerciseComments imports from MDX files."
echo "Checking for any remaining imports..."

# Check if any imports remain
remaining=$(grep -r "import.*ExerciseComments" src/content/ --include="*.mdx" | wc -l)
echo "Remaining ExerciseComments imports: $remaining"

if [ $remaining -eq 0 ]; then
    echo "✅ All ExerciseComments imports have been successfully removed!"
else
    echo "❌ Some ExerciseComments imports still remain. Please check manually."
    grep -r "import.*ExerciseComments" src/content/ --include="*.mdx"
fi
