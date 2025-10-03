#!/usr/bin/env python3
"""
Fix B1 Übungen files to have proper MDX structure with ExerciseTable components
"""
import os
import re

BASE_DIR = "src/content/b1niveau/Übungen"

# Folders that need fixing
FOLDERS_TO_FIX = [
    "artikelwoerter-pronomen",
    "doppelkonjunktionen",
    "passiv"
]

def convert_text_to_exercise_table(content, folder_name, file_number):
    """Convert plain text exercises to ExerciseTable component format"""
    
    # Remove existing import if present
    content = re.sub(r'import.*ExerciseComments.*\n', '', content)
    content = re.sub(r'import.*exercise-comments.*\n', '', content)
    
    # Split into lines
    lines = content.strip().split('\n')
    
    # Build frontmatter
    folder_titles = {
        "artikelwoerter-pronomen": "Artikelwörter und Pronomen",
        "doppelkonjunktionen": "Doppelkonjunktionen",
        "passiv": "Passiv"
    }
    
    folder_title = folder_titles.get(folder_name, folder_name.replace('-', ' ').title())
    
    frontmatter = f'''---
title: "B1 {folder_title} - Teil {file_number}"
description: "Bài tập thực hành {folder_title} - Cấp độ B1"
tags: ["B1", "{folder_title}", "Grammatik", "Übungen"]
---
'''
    
    # Add imports
    imports = '''
import ExerciseComments from "@/components/exercises/ExerciseComments";
'''
    
    # Build title
    title = f'\n# B1 {folder_title} - Teil {file_number}\n\n'
    
    # Extract existing title if present
    existing_title_match = re.match(r'^(Teil \d+:.*?)$', lines[0], re.MULTILINE) if lines else None
    instruction_text = existing_title_match.group(1) if existing_title_match else f"Hoàn thành bài tập sau"
    
    # Start building exercise table
    exercise_table_start = f'''<ExerciseTable>
  <ExerciseHeader>
    <ExerciseInstruction>
      {instruction_text}
    </ExerciseInstruction>
  </ExerciseHeader>

  <ExerciseBody>
'''
    
    exercise_items = []
    
    # Parse exercise items (numbered list format)
    for line in lines:
        # Match pattern: "1. Some text ___ more text. [answer]"
        match = re.match(r'^(\d+)\.\s+(.+?)\s+\[(.+?)\]$', line.strip())
        if match:
            number, sentence, answer = match.groups()
            
            # Build exercise item
            item = f'''    <ExerciseItem>
      <ExerciseSentence>
        {sentence}
      </ExerciseSentence>
      <ExerciseAnswer>{answer}</ExerciseAnswer>
      <ExerciseExplanation>
        Đáp án đúng: {answer}
      </ExerciseExplanation>
    </ExerciseItem>
'''
            exercise_items.append(item)
    
    exercise_table_end = '''  </ExerciseBody>
</ExerciseTable>
'''
    
    # Add comments section
    exercise_id = f"b1-{folder_name}-teil{file_number}"
    url = f"/b1niveau/übungen/{folder_name}/teil{file_number}"
    
    comments_section = f'''

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="{exercise_id}"
  url="{url}"
/>
'''
    
    # Combine all parts
    if exercise_items:
        result = (frontmatter + imports + title + 
                 exercise_table_start + '\n'.join(exercise_items) + 
                 exercise_table_end + comments_section)
    else:
        # If no exercises found, return with basic structure
        result = frontmatter + imports + title + "⚠️ Nội dung cần được cập nhật\n" + comments_section
    
    return result

def process_folder(folder_name):
    """Process all teil*.mdx files in a folder"""
    folder_path = os.path.join(BASE_DIR, folder_name)
    
    if not os.path.exists(folder_path):
        print(f"❌ Folder not found: {folder_path}")
        return
    
    files = [f for f in os.listdir(folder_path) if f.startswith('teil') and f.endswith('.mdx')]
    files.sort()
    
    print(f"\n📁 Processing folder: {folder_name}")
    print(f"   Found {len(files)} files: {files}")
    
    for filename in files:
        file_path = os.path.join(folder_path, filename)
        
        # Extract part number
        part_match = re.match(r'teil(\d+)\.mdx', filename)
        if not part_match:
            continue
        part_number = part_match.group(1)
        
        print(f"   📄 Processing: {filename}")
        
        # Read existing content
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has proper structure
        if content.startswith('---') and '<ExerciseTable>' in content:
            print(f"      ✅ Already has proper structure, skipping")
            continue
        
        # Convert to proper format
        new_content = convert_text_to_exercise_table(content, folder_name, part_number)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"      ✅ Updated: {filename}")

def main():
    print("🔧 Fixing B1 Übungen files...")
    print(f"📂 Base directory: {BASE_DIR}")
    
    for folder in FOLDERS_TO_FIX:
        process_folder(folder)
    
    print("\n✨ Done! All files have been updated.")
    print("\n📝 Summary:")
    print("   - Added proper frontmatter with title, description, tags")
    print("   - Converted text exercises to ExerciseTable components")
    print("   - Added ExerciseComments section at the end")
    print("   - Ready for interactive display!")

if __name__ == "__main__":
    main()
