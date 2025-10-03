#!/usr/bin/env python3
"""
Convert special format B1 Übungen files (without frontmatter) to ExerciseTable format
"""

import re
from pathlib import Path

def convert_special_format_file(file_path: Path, title: str, description: str):
    """Convert files with special inline [answer] format"""
    print(f"\n{'='*80}")
    print(f"Converting: {file_path.name}")
    print(f"{'='*80}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract exercise lines - pattern: "number. sentence [answer]"
    pattern = r'^\d+\.\s+(.*?)\s+\[([^\]]+)\]'
    matches = re.finditer(pattern, content, re.MULTILINE)
    
    exercises = []
    for match in matches:
        german = match.group(1).strip()
        answer = match.group(2).strip()
        
        # Clean german text - replace markdown bold and other formatting
        german = re.sub(r'\*\*_\s*', '___', german)  # **_ -> ___
        german = re.sub(r'\s*_\*\*', '', german)  # _** -> nothing
        german = german.replace('**', '')  # Remove any remaining **
        german = german.strip()
        
        # Handle answers with "/" separator
        if ' / ' in answer:
            answers = [a.strip() for a in answer.split(' / ')]
        else:
            answers = [answer]
        
        exercise = {
            'id': len(exercises) + 1,
            'german': german,
            'correctAnswer': answers
        }
        exercises.append(exercise)
    
    if not exercises:
        print(f"⚠️  No exercises found")
        return
    
    print(f"✅ Extracted {len(exercises)} exercises")
    
    # Generate exercise lines
    def escape_quotes(text):
        return text.replace('"', '\\"')
    
    def generate_line(ex):
        german = escape_quotes(ex['german'])
        answers = ', '.join([f'"{escape_quotes(a)}"' for a in ex['correctAnswer']])
        return f'{{id: {ex["id"]}, german: "{german}", correctAnswer: [{answers}]}}'
    
    exercise_lines = [generate_line(ex) for ex in exercises]
    exercises_str = ', '.join(exercise_lines)
    
    # Generate new content
    new_content = f'''---
title: "{title}"
description: "{description}"
tags: ["B1", "Übungen", "Grammatik"]
---

import {{ ExerciseTable }} from "@/components/exercises/exercise-table";
import ExerciseComments from "@/components/exercises/ExerciseComments";

# {title}

<ExerciseTable
  title="{title}"
  subtitle="{description}"
  exercises={{[{exercises_str}]}}
/>

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="b1-{file_path.parent.name}-{file_path.stem}"
  url="/b1niveau/übungen/{file_path.parent.name}/{file_path.stem}"
/>
'''
    
    # Write new content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Converted successfully - {len(exercises)} exercises")

def main():
    base_path = Path('/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/Übungen')
    
    special_files = [
        {
            'path': 'adjektive/teil2.mdx',
            'title': 'B1 Adjektive - Teil 2: Partizip Präsens',
            'description': 'Bài tập thực hành Partizip Präsens als Adjektiv (Inf + d + Adjektivendung)'
        },
        {
            'path': 'adjektive/teil3.mdx',
            'title': 'B1 Adjektive - Teil 3: Partizip Perfekt',
            'description': 'Bài tập thực hành Partizip Perfekt als Adjektiv'
        },
        {
            'path': 'praepositionen/teil2.mdx',
            'title': 'B1 Präpositionen - Teil 2: Lokale Präpositionen',
            'description': 'Bài tập thực hành giới từ chỉ nơi chốn (um...herum, an...entlang, innerhalb, außerhalb)'
        },
        {
            'path': 'praepositionen/teil3.mdx',
            'title': 'B1 Präpositionen - Teil 3: Temporale Präpositionen',
            'description': 'Bài tập thực hành giới từ chỉ thời gian'
        }
    ]
    
    print("\n" + "="*80)
    print("CONVERTING SPECIAL FORMAT B1 ÜBUNGEN FILES")
    print("="*80)
    print(f"Total files: {len(special_files)}")
    
    converted = 0
    
    for file_info in special_files:
        file_path = base_path / file_info['path']
        
        if not file_path.exists():
            print(f"\n⚠️  File not found: {file_path}")
            continue
        
        try:
            convert_special_format_file(
                file_path,
                file_info['title'],
                file_info['description']
            )
            converted += 1
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*80)
    print(f"✅ Converted: {converted}/{len(special_files)}")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
