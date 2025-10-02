#!/bin/bash

# Script to add ExerciseComments to all B1 exercise files
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme

# List of files that need ExerciseComments (excluding teil1 which is already done and konjunktiv-ii/teil1 which already has it)
files=(
    "src/content/b1niveau/Übungen/adjektive/teil2.mdx"
    "src/content/b1niveau/Übungen/adjektive/teil3.mdx"
    "src/content/b1niveau/Übungen/artikelwoerter-pronomen/teil1.mdx"
    "src/content/b1niveau/Übungen/artikelwoerter-pronomen/teil2.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil1.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil2.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil3.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil4.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil5.mdx"
    "src/content/b1niveau/Übungen/doppelkonjunktionen/teil6.mdx"
    "src/content/b1niveau/Übungen/konjunktiv-ii/teil2.mdx"
    "src/content/b1niveau/Übungen/konjunktiv-ii/teil3.mdx"
    "src/content/b1niveau/Übungen/konjunktiv-ii/teil4.mdx"
    "src/content/b1niveau/Übungen/konjunktiv-ii/teil5.mdx"
    "src/content/b1niveau/Übungen/konjunktiv-ii/teil6.mdx"
    "src/content/b1niveau/Übungen/passiv/teil1.mdx"
    "src/content/b1niveau/Übungen/passiv/teil2.mdx"
    "src/content/b1niveau/Übungen/praepositionen/teil1.mdx"
    "src/content/b1niveau/Übungen/praepositionen/teil2.mdx"
    "src/content/b1niveau/Übungen/praepositionen/teil3.mdx"
    "src/content/b1niveau/Übungen/relativsatze/teil1.mdx"
    "src/content/b1niveau/Übungen/relativsatze/teil2.mdx"
    "src/content/b1niveau/Übungen/relativsatze/teil3.mdx"
    "src/content/b1niveau/Übungen/relativsatze/teil4.mdx"
    "src/content/b1niveau/Übungen/relativsatze/teil5.mdx"
    "src/content/b1niveau/Übungen/verben-mit-praepositionen/teil1.mdx"
    "src/content/b1niveau/Übungen/verben-mit-praepositionen/teil2.mdx"
    "src/content/b1niveau/Übungen/verben-mit-praepositionen/teil3.mdx"
)

for file in "${files[@]}"; do
    if [[ -f "$file" ]]; then
        echo "Processing $file..."
        
        # Extract category and part from filepath
        category=$(echo $file | sed 's|.*/Übungen/\([^/]*\)/.*|\1|')
        part=$(basename $file .mdx)
        
        # Check if file doesn't already have ExerciseComments
        if ! grep -q "ExerciseComments" "$file"; then
            echo "  Adding ExerciseComments to $file"
            
            # Read the file content
            content=$(cat "$file")
            
            # Add import after frontmatter (after first ---)
            if echo "$content" | grep -q "^---" && echo "$content" | grep -q "^import"; then
                # File already has imports, add to existing imports
                sed -i.bak "/^import.*from.*['\"]@\/components/i\\
import { ExerciseComments } from '@/components/exercise-comments'" "$file"
            elif echo "$content" | grep -q "^---"; then
                # File has frontmatter but no imports, add after frontmatter
                awk '/^---$/ && seen++ {print; print ""; print "import { ExerciseComments } from '\''@/components/exercise-comments'\''"; next} 1' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
            else
                # File has no frontmatter, add at top
                echo "import { ExerciseComments } from '@/components/exercise-comments'" > "$file.tmp"
                echo "" >> "$file.tmp"
                cat "$file" >> "$file.tmp"
                mv "$file.tmp" "$file"
            fi
            
            # Add component at the end (before any existing author credit)
            if grep -q "ExerciseAuthor" "$file"; then
                # Add before ExerciseAuthor
                sed -i.bak '/^<ExerciseAuthor/i\\
<ExerciseComments exerciseId="b1-'$category'-'$part'" url="/b1niveau/Übungen/'$category'/'$part'" />\
' "$file"
            else
                # Add at the end
                echo "" >> "$file"
                echo "<ExerciseComments exerciseId=\"b1-$category-$part\" url=\"/b1niveau/Übungen/$category/$part\" />" >> "$file"
            fi
            
            # Clean up backup files
            rm -f "$file.bak"
            
            echo "  ✅ Added ExerciseComments to $file"
        else
            echo "  ⏭️  Skipping $file (already has ExerciseComments)"
        fi
    else
        echo "  ❌ File not found: $file"
    fi
done

echo "✨ Finished processing B1 exercise files!"
