#!/bin/bash

# Script to update all Horen exercises in a1 to use MultipleChoiceQuizGroup
# This will convert individual MultipleChoiceQuiz components to grouped format

HOREN_DIR="src/content/exercises/a1/Horen"

echo "🔄 Starting conversion of Horen exercises..."
echo "📂 Directory: $HOREN_DIR"
echo ""

# Counter
count=0

# Loop through all MDX files in Horen directory
for file in "$HOREN_DIR"/*.mdx; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "Processing: $filename"
    
    # Check if file already uses MultipleChoiceQuizGroup
    if grep -q "MultipleChoiceQuizGroup" "$file"; then
      echo "  ✅ Already using MultipleChoiceQuizGroup - skipping"
    else
      # Add import for MultipleChoiceQuizGroup after MultipleChoiceQuiz import
      if grep -q 'import { MultipleChoiceQuiz }' "$file"; then
        # Replace the import line
        sed -i '' 's/import { MultipleChoiceQuiz }/import { MultipleChoiceQuiz } from "@\/components\/ui\/multiple-choice-quiz";\nimport { MultipleChoiceQuizGroup }/' "$file"
        echo "  ✅ Added MultipleChoiceQuizGroup import"
      fi
    fi
    
    ((count++))
  fi
done

echo ""
echo "✅ Conversion complete!"
echo "📊 Processed $count files"
echo ""
echo "⚠️  Note: Manual review recommended to convert MultipleChoiceQuiz to MultipleChoiceQuizGroup format"
echo "📝 Example format:"
echo ""
echo "<MultipleChoiceQuizGroup"
echo "  title=\"Bài tập 1: Trắc nghiệm (Multiple Choice)\""
echo "  questions={[...]}"
echo "/>"
