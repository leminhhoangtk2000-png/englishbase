#!/usr/bin/env python3
import os
import re

# Directory containing B1 Grammatik files
grammatik_dir = "src/content/b1niveau/grammatik"

# Import statement to add
import_statement = 'import ExerciseComments from "@/components/exercises/ExerciseComments";\n'

# Template for comments section
def get_comments_section(file_slug):
    return f"""

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="b1-grammatik-{file_slug}"
  url="/b1niveau/grammatik/{file_slug}"
/>
"""

# Get all .mdx files except index.mdx
files = [f for f in os.listdir(grammatik_dir) if f.endswith('.mdx') and f != 'index.mdx']
files.sort()

for filename in files:
    filepath = os.path.join(grammatik_dir, filename)
    file_slug = filename.replace('.mdx', '')
    
    print(f"Processing: {filename}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has import
    if 'import ExerciseComments' in content:
        print(f"  ⏩ Already has import, skipping: {filename}")
        continue
    
    # Check if already has comments section
    if 'ExerciseComments' in content or 'Hỏi đáp & Thảo luận' in content:
        print(f"  ⏩ Already has comments, skipping: {filename}")
        continue
    
    # Split frontmatter and content
    parts = content.split('---', 2)
    if len(parts) >= 3:
        # Has frontmatter
        frontmatter = parts[1]
        body = parts[2]
        
        # Add import after frontmatter
        new_content = f"---{frontmatter}---\n{import_statement}{body}"
    else:
        # No frontmatter, add import at the beginning
        new_content = import_statement + content
    
    # Add comments section at the end
    new_content = new_content.rstrip() + get_comments_section(file_slug)
    
    # Write back to file
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✅ Added comments to: {filename}")

print("\n✨ Done! All B1 Grammatik files have been updated with comment sections.")
