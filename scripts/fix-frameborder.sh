#!/bin/bash

# Script to fix frameborder -> frameBorder in all MDX files
# This fixes React DOM property casing error

echo "🔍 Finding all files with 'frameborder' (lowercase)..."

# Count total matches
TOTAL=$(grep -r "frameborder" --include="*.mdx" --include="*.tsx" --include="*.jsx" src/ content/ 2>/dev/null | wc -l)
echo "Found $TOTAL occurrences"

echo ""
echo "🔧 Replacing frameborder -> frameBorder..."

# Use sed to replace in all files
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  find src/ content/ -type f \( -name "*.mdx" -o -name "*.tsx" -o -name "*.jsx" \) -exec sed -i '' 's/frameborder="/frameBorder="/g' {} +
else
  # Linux
  find src/ content/ -type f \( -name "*.mdx" -o -name "*.tsx" -o -name "*.jsx" \) -exec sed -i 's/frameborder="/frameBorder="/g' {} +
fi

echo "✅ Replacement complete!"

echo ""
echo "🔍 Verifying changes..."
REMAINING=$(grep -r "frameborder" --include="*.mdx" --include="*.tsx" --include="*.jsx" src/ content/ 2>/dev/null | wc -l)

if [ "$REMAINING" -eq 0 ]; then
  echo "✅ All frameborder occurrences have been fixed!"
else
  echo "⚠️  Still found $REMAINING occurrences. Manual review may be needed."
  echo ""
  echo "Files still containing 'frameborder':"
  grep -r "frameborder" --include="*.mdx" --include="*.tsx" --include="*.jsx" src/ content/ 2>/dev/null | cut -d: -f1 | sort -u
fi

echo ""
echo "📊 Summary:"
echo "   Fixed: $TOTAL occurrences"
echo "   Remaining: $REMAINING"
echo ""
echo "💡 Next step: Restart dev server to see changes"
