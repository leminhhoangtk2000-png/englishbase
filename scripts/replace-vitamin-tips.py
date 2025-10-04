#!/usr/bin/env python3
"""
Replace VITAMIN ĐỘNG LỰC tips with ExerciseComments component
"""

import os
import re
from pathlib import Path

def generate_exercise_id(file_path):
    """Generate exerciseId from file path"""
    # Extract level and topic from path
    parts = file_path.parts
    
    # Try to find niveau folder
    niveau = None
    for part in parts:
        if 'niveau' in part.lower():
            if 'a1' in part.lower():
                niveau = 'a1'
            elif 'a2' in part.lower():
                niveau = 'a2'
            elif 'b1' in part.lower():
                niveau = 'b1'
            elif 'b2' in part.lower():
                niveau = 'b2'
            break
    
    # If not found in folder name, check parent folders
    if not niveau:
        for i, part in enumerate(parts):
            if part in ['a1', 'a2', 'b1', 'b2']:
                niveau = part
                break
    
    # Get filename without extension
    filename = file_path.stem
    
    # Generate ID
    if niveau:
        exercise_id = f"{niveau}-{filename}".lower().replace(' ', '-').replace('_', '-')
    else:
        exercise_id = filename.lower().replace(' ', '-').replace('_', '-')
    
    return exercise_id

def generate_url(file_path):
    """Generate URL from file path"""
    parts = file_path.parts
    
    # Find content root
    try:
        content_idx = parts.index('content')
        relative_parts = parts[content_idx + 1:]
    except ValueError:
        # Fallback: use last few parts
        relative_parts = parts[-3:]
    
    # Remove extension
    url_parts = list(relative_parts[:-1]) + [relative_parts[-1].replace('.mdx', '').replace('.md', '')]
    
    return '/' + '/'.join(url_parts)

def replace_vitamin_tip(content, exercise_id, url):
    """Replace VITAMIN ĐỘNG LỰC tip with ExerciseComments"""
    
    # Pattern to match the tip block
    pattern = r':::tip VITAMIN ĐỘNG LỰC 🌱.*?:::'
    
    # Replacement text
    replacement = f'''### **Hỏi đáp ❓💬**

<ExerciseComments
  exerciseId="{exercise_id}"
  url="{url}"
/>'''
    
    # Replace all occurrences
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    return new_content

def add_import_if_needed(content):
    """Add ExerciseComments import if not present"""
    if 'ExerciseComments' in content:
        return content
    
    # Find import section (usually after frontmatter)
    lines = content.split('\n')
    
    # Find the end of frontmatter
    frontmatter_end = -1
    in_frontmatter = False
    dash_count = 0
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            dash_count += 1
            if dash_count == 2:
                frontmatter_end = i
                break
    
    if frontmatter_end == -1:
        # No frontmatter, add at top
        import_line = "import { ExerciseComments } from '@/components/exercises/exercise-comments';\n"
        return import_line + content
    
    # Find existing imports
    import_end = frontmatter_end + 1
    for i in range(frontmatter_end + 1, len(lines)):
        if lines[i].strip().startswith('import '):
            import_end = i + 1
        elif lines[i].strip() and not lines[i].strip().startswith('import '):
            break
    
    # Add import after existing imports
    import_line = "import { ExerciseComments } from '@/components/exercises/exercise-comments';"
    lines.insert(import_end, import_line)
    
    return '\n'.join(lines)

def process_file(file_path):
    """Process a single file"""
    try:
        # Try UTF-8 first, then fallback to latin-1
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            with open(file_path, 'r', encoding='latin-1') as f:
                content = f.read()
        
        # Check if file contains VITAMIN ĐỘNG LỰC
        if 'VITAMIN ĐỘNG LỰC' not in content:
            return False
        
        print(f"Processing: {file_path}")
        
        # Generate exercise ID and URL
        exercise_id = generate_exercise_id(file_path)
        url = generate_url(file_path)
        
        print(f"  - Exercise ID: {exercise_id}")
        print(f"  - URL: {url}")
        
        # Replace vitamin tip
        new_content = replace_vitamin_tip(content, exercise_id, url)
        
        # Add import if needed
        new_content = add_import_if_needed(new_content)
        
        # Write back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Updated")
        return True
        
    except Exception as e:
        print(f"  ❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main function"""
    print("🔍 Replacing VITAMIN ĐỘNG LỰC tips with ExerciseComments...\n")
    
    # Find all MDX files
    root = Path('.')
    mdx_files = list(root.rglob('*.mdx')) + list(root.rglob('*.md'))
    
    print(f"Found {len(mdx_files)} MDX/MD files\n")
    
    updated_count = 0
    
    for file_path in mdx_files:
        if process_file(file_path):
            updated_count += 1
    
    print(f"\n✨ Done! Updated {updated_count} files.")

if __name__ == "__main__":
    main()
