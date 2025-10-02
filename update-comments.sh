#!/bin/bash

# Script to add ExerciseComments to all A1/Übungen files

cd "/Users/khoavo/Documents/GitHub/deutsch/Edu-theme"

# List of files to update (excluding artikel/teil-1.mdx, artikel/teil-2.mdx, 0-bai-tap-ngu-phap-a1.md, and ubungsfragen files)
files=(
    "src/content/a1niveau/Übungen/trennbare-verben/teil2.mdx"
    "src/content/a1niveau/Übungen/trennbare-verben/teil3.mdx"
    "src/content/a1niveau/Übungen/trennbare-verben/teil4.mdx"
    "src/content/a1niveau/Übungen/imperativ/teil1.mdx"
    "src/content/a1niveau/Übungen/imperativ/teil2.mdx"
    "src/content/a1niveau/Übungen/nicht-und-kein/teil1.mdx"
    "src/content/a1niveau/Übungen/nicht-und-kein/teil2.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil1.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil2.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil3.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil4.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil5.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil6.mdx"
    "src/content/a1niveau/Übungen/perfekt-ubungen/teil7.mdx"
)

echo "Files that need ExerciseComments:"
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "  - $file"
    fi
done
