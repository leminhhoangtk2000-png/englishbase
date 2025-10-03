#!/usr/bin/env python3
"""
Convert A2 Übungen from Lueckentext to ExerciseTable component
"""

import re
import os
from pathlib import Path

UBUNGEN_DIR = Path("src/content/a2niveau/Übungen")

FILES_TO_CONVERT = [
    "adjektivendungen/teil1.mdx",
    "adjektivendungen/teil2.mdx",
    "adjektivendungen/teil4.mdx",
    "steigerung/teil1.mdx",
    "steigerung/teil3.mdx",
    "perfekt-prateritum/teil1.mdx",
    "perfekt-prateritum/teil2.mdx",
    "perfekt-prateritum/teil3.mdx",
    "plusquamperfekt/teil2.mdx",
    "plusquamperfekt/teil3.mdx",
    "nebensatze/teil1.mdx",
    "passiv/teil1.mdx",
    "passiv/teil2.mdx",
    "futur/teil1.mdx",
    "possessivpronomen/teil1.mdx",
    "possessivpronomen/teil2.mdx",
    "reflexivpronomen/teil1.mdx",
    "reflexivpronomen/teil2.mdx",
    "reflexivpronomen/teil3.mdx",
    "reflexivpronomen/teil4.mdx",
    "reflexivpronomen/teil5.mdx",
]

def extract_exercises_from_lueckentext(lueckentext_block):
    """Extract exercises from Lueckentext textParts"""
    exercises = []
    
    # Find all question lines
    # Pattern: "1. Text ", { type: "blank", correctAnswer: "answer" }, " more text", "\n",
    pattern = r'"(\d+)\.\s+(.*?)"\s*,?\s*(?:{ type: "blank", correctAnswer: "([^"]+)" })?'
    
    lines = lueckentext_block.split('\\n",')
    
    for line in lines:
        # Find question number and text
        match = re.search(r'"(\d+)\.\s+(.*?)(?:"\s*,\s*{|$)', line)
        if not match:
            continue
            
        question_num = int(match.group(1))
        question_text = match.group(2)
        
        # Find all correctAnswer values in this line
        answers = re.findall(r'correctAnswer:\s*"([^"]+)"', line)
        
        if answers:
            # Replace blanks with __
            german = question_text
            for _ in answers:
                german = re.sub(r'\s*{[^}]+}\s*', ' __ ', german, count=1)
            
            # Clean up extra spaces
            german = re.sub(r'\s+', ' ', german).strip()
            
            exercises.append({
                'id': question_num,
                'german': german,
                'correctAnswer': answers
            })
    
    return exercises

def convert_lueckentext_to_exercise_table(lueckentext_block, title="", subtitle=""):
    """Convert a Lueckentext component to ExerciseTable"""
    exercises = extract_exercises_from_lueckentext(lueckentext_block)
    
    if not exercises:
        return None
    
    # Build exercises array
    exercises_lines = []
    for ex in exercises:
        answers_str = ', '.join(f'"{a}"' for a in ex['correctAnswer'])
        exercises_lines.append(
            f'    {{id: {ex["id"]}, german: "{ex["german"]}", correctAnswer: [{answers_str}]}},'
        )
    
    exercises_str = '\n'.join(exercises_lines)
    
    result = f'''<ExerciseTable
  title="{title}"
  subtitle="{subtitle}"
  exercises={{[
{exercises_str}
  ]}}
/>'''
    
    return result

def convert_file(file_path):
    """Convert a single file from Lueckentext to ExerciseTable"""
    print(f"\n📝 Processing: {file_path.relative_to(UBUNGEN_DIR)}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already converted
    if 'ExerciseTable' in content:
        print("  ⏭️  Already using ExerciseTable, skipping...")
        return
    
    if 'Lueckentext' not in content:
        print("  ⚠️  No Lueckentext found, skipping...")
        return
    
    # Update imports
    content = re.sub(
        r'import Lueckentext from ["\'@]@site/src/components/Quiz/Lueckentext/Lueckentext["\'];?',
        'import { ExerciseTable } from "@/components/exercises/exercise-table";',
        content
    )
    
    content = re.sub(
        r'import AuthorCredit from ["\'@]@site/src/components/Special/AuthorCredit/AuthorCredit["\'];?',
        'import { ExerciseAuthor, ExerciseHelp } from "@/components/exercises/exercise-author";',
        content
    )
    
    content = re.sub(
        r'import ExerciseComments from ["\'@]@site/src/components/exercise-comments["\'];?',
        'import ExerciseComments from "@/components/exercises/ExerciseComments";',
        content
    )
    
    # Find section headers before each Lueckentext for titles
    sections = re.findall(r'##\s+([^\n]+)\s+<Lueckentext', content, re.DOTALL)
    
    # Find and replace Lueckentext components
    lueckentext_blocks = re.findall(r'<Lueckentext[\s\S]*?/>', content)
    
    converted_count = 0
    for i, block in enumerate(lueckentext_blocks):
        title = sections[i] if i < len(sections) else f"Teil {i+1}"
        title = title.strip()
        
        exercise_table = convert_lueckentext_to_exercise_table(block, title, "Luyện tập")
        
        if exercise_table:
            content = content.replace(block, exercise_table, 1)
            converted_count += 1
    
    # Replace AuthorCredit with ExerciseAuthor
    content = re.sub(
        r'<AuthorCredit\s+author="([^"]+)"\s*/>',
        r'''<ExerciseAuthor
  name="\1"
  description="Mình là một Gen Z đang đồng hành cùng các bạn trên hành trình chinh phục tiếng Đức 🇩🇪"
/>

<ExerciseHelp />''',
        content
    )
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    if converted_count > 0:
        print(f"  ✅ Converted {converted_count} Lueckentext components")
    else:
        print(f"  ⚠️  Could not convert (complex format)")

def main():
    print("🚀 Starting A2 Übungen conversion...")
    
    processed = 0
    skipped = 0
    
    for file_rel in FILES_TO_CONVERT:
        file_path = UBUNGEN_DIR / file_rel
        if file_path.exists():
            try:
                convert_file(file_path)
                processed += 1
            except Exception as e:
                print(f"  ❌ Error: {e}")
                skipped += 1
        else:
            print(f"⚠️  File not found: {file_rel}")
            skipped += 1
    
    print(f"\n✅ Conversion complete!")
    print(f"📊 Processed: {processed} files")
    print(f"⏭️  Skipped: {skipped} files")

if __name__ == '__main__':
    main()
