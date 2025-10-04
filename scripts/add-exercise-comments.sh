#!/bin/bash

# Script to add ExerciseComments component to all A2 and B1 exercise files
# Usage: ./add-exercise-comments.sh

echo "🔧 Adding ExerciseComments to A2 and B1 exercises..."
echo ""

# Function to generate exerciseId from file path
generate_exercise_id() {
    local file_path="$1"
    # Extract level (a2 or b1)
    local level=$(echo "$file_path" | grep -oE "(a2|b1)")
    # Extract category (Horen or Lesen)
    local category=$(echo "$file_path" | grep -oE "(Horen|Lesen)" | tr '[:upper:]' '[:lower:]')
    # Extract filename without extension
    local filename=$(basename "$file_path" .mdx)
    # Clean filename: lowercase, replace spaces with hyphens, remove special chars
    local clean_name=$(echo "$filename" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g')
    
    echo "${level}-${category}-${clean_name}"
}

# Function to generate URL from file path
generate_url() {
    local file_path="$1"
    # Extract level (a2 or b1)
    local level=$(echo "$file_path" | grep -oE "(a2|b1)")
    # Extract category (Horen or Lesen)
    local category=$(echo "$file_path" | grep -oE "(Horen|Lesen)")
    # Extract filename without extension
    local filename=$(basename "$file_path" .mdx)
    
    echo "/exercises/${level}/${category}/${filename}"
}

# Function to add ExerciseComments to a file
add_comments_to_file() {
    local file_path="$1"
    
    # Check if file already has ExerciseComments
    if grep -q "ExerciseComments" "$file_path"; then
        echo "⏭️  Skipping (already has comments): $(basename "$file_path")"
        return
    fi
    
    # Generate exerciseId and url
    local exercise_id=$(generate_exercise_id "$file_path")
    local url=$(generate_url "$file_path")
    
    # Create the ExerciseComments component
    local comments_component="
<ExerciseComments
  exerciseId=\"${exercise_id}\"
  url=\"${url}\"
/>"
    
    # Add component at the end of the file (before the last line if it's just closing tag)
    echo "$comments_component" >> "$file_path"
    
    echo "✅ Added to: $(basename "$file_path")"
    echo "   exerciseId: ${exercise_id}"
    echo "   url: ${url}"
}

# Counter
total_files=0
processed_files=0

# Process A2 exercises
echo "📁 Processing A2 exercises..."
echo "----------------------------"
for file in src/content/exercises/a2/**/*.mdx; do
    if [ -f "$file" ]; then
        total_files=$((total_files + 1))
        add_comments_to_file "$file"
        processed_files=$((processed_files + 1))
    fi
done

echo ""
echo "📁 Processing B1 exercises..."
echo "----------------------------"
for file in src/content/exercises/b1/**/*.mdx; do
    if [ -f "$file" ]; then
        total_files=$((total_files + 1))
        add_comments_to_file "$file"
        processed_files=$((processed_files + 1))
    fi
done

echo ""
echo "✅ Complete!"
echo "Total files found: $total_files"
echo "Files processed: $processed_files"
