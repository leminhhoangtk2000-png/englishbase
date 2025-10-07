#!/bin/bash

# Script to remove all ExerciseComments tags from MDX files

echo "Removing all ExerciseComments tags from MDX files..."

# Find all MDX files and remove ExerciseComments tags
find src/content -name "*.mdx" -type f -exec sed -i '' '/<ExerciseComments/,/\/>/d' {} \;

echo "Completed removing ExerciseComments tags from MDX files."
echo "Checking for any remaining references..."

# Check if any references remain
remaining=$(grep -r "<ExerciseComments" src/content/ --include="*.mdx" | wc -l)
echo "Remaining ExerciseComments references: $remaining"

if [ $remaining -eq 0 ]; then
    echo "✅ All ExerciseComments tags have been successfully removed!"
else
    echo "❌ Some ExerciseComments tags still remain. Please check manually."
    grep -r "<ExerciseComments" src/content/ --include="*.mdx"
fi
