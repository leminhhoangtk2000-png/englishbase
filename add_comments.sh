#!/bin/bash

# Script to add ExerciseComments to A2 exercise files
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme

files=(
    "src/content/a2niveau/Übungen/steigerung/teil3.mdx"
    "src/content/a2niveau/Übungen/possessivpronomen/teil1.mdx"
    "src/content/a2niveau/Übungen/possessivpronomen/teil2.mdx"
    "src/content/a2niveau/Übungen/reflexivpronomen/teil1.mdx"
    "src/content/a2niveau/Übungen/reflexivpronomen/teil2.mdx"
    "src/content/a2niveau/Übungen/reflexivpronomen/teil3.mdx"
    "src/content/a2niveau/Übungen/reflexivpronomen/teil4.mdx"
    "src/content/a2niveau/Übungen/reflexivpronomen/teil5.mdx"
    "src/content/a2niveau/Übungen/futur/teil1.mdx"
    "src/content/a2niveau/Übungen/futur/teil2.mdx"
    "src/content/a2niveau/Übungen/genitiv/teil1.mdx"
    "src/content/a2niveau/Übungen/genitiv/teil2.mdx"
    "src/content/a2niveau/Übungen/genitiv/teil3.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil1.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil2.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil3.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil4.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil5.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil6.mdx"
    "src/content/a2niveau/Übungen/nebensatze/teil7.mdx"
    "src/content/a2niveau/Übungen/passiv/teil1.mdx"
    "src/content/a2niveau/Übungen/passiv/teil2.mdx"
    "src/content/a2niveau/Übungen/passiv/teil3.mdx"
    "src/content/a2niveau/Übungen/passiv/teil4.mdx"
    "src/content/a2niveau/Übungen/perfekt-prateritum/teil1.mdx"
    "src/content/a2niveau/Übungen/perfekt-prateritum/teil2.mdx"
    "src/content/a2niveau/Übungen/perfekt-prateritum/teil3.mdx"
    "src/content/a2niveau/Übungen/perfekt-prateritum/teil4.mdx"
    "src/content/a2niveau/Übungen/perfekt-prateritum/teil5.mdx"
    "src/content/a2niveau/Übungen/plusquamperfekt/teil1.mdx"
    "src/content/a2niveau/Übungen/plusquamperfekt/teil2.mdx"
    "src/content/a2niveau/Übungen/plusquamperfekt/teil3.mdx"
)

for file in "${files[@]}"; do
    echo "Processing $file..."
    
    # Extract category and part from filepath
    category=$(echo $file | sed 's|.*/Übungen/\([^/]*\)/.*|\1|')
    part=$(basename $file .mdx)
    
    # Check if file exists and doesn't already have ExerciseComments
    if [[ -f "$file" ]] && ! grep -q "ExerciseComments" "$file"; then
        echo "  Adding ExerciseComments to $file"
        
        # Add import at the top (after existing imports)
        sed -i.bak '1s/^/import { ExerciseComments } from '\''@\/components\/exercise-comments'\'\'$'\n''/' "$file"
        
        # Add component at the end
        echo "" >> "$file"
        echo "<ExerciseComments exerciseId=\"a2-$category-$part\" url=\"/a2niveau/Übungen/$category/$part\" />" >> "$file"
        
        echo "  ✅ Added ExerciseComments to $file"
    else
        echo "  ⏭️  Skipping $file (already has ExerciseComments or doesn't exist)"
    fi
done

echo "✨ Finished processing all files!"
