#!/usr/bin/env python3
"""
Convert remaining 3 B1 Übungen files that still use nested component format
"""

import re
from pathlib import Path
import sys

# Import the conversion function from the main script
sys.path.append(str(Path(__file__).parent))

def extract_exercises_from_nested_format(content: str) -> list:
    """Extract exercises from nested component format"""
    exercises = []
    
    # Pattern to match ExerciseItem blocks
    pattern = r'<ExerciseItem>\s*<ExerciseSentence>\s*(.*?)\s*</ExerciseSentence>\s*<ExerciseAnswer>(.*?)</ExerciseAnswer>(?:\s*<ExerciseExplanation>\s*(.*?)\s*</ExerciseExplanation>)?'
    
    matches = re.finditer(pattern, content, re.DOTALL)
    
    for idx, match in enumerate(matches, start=1):
        german = match.group(1).strip()
        answer = match.group(2).strip()
        explanation = match.group(3).strip() if match.group(3) else None
        
        # Clean up german sentence (remove extra whitespace)
        german = re.sub(r'\s+', ' ', german)
        
        # Handle special answer formats
        if ' / ' in answer:
            answers = [a.strip() for a in answer.split(' / ')]
        else:
            answers = [answer]
        
        exercise = {
            'id': idx,
            'german': german,
            'correctAnswer': answers,
            'explanation': explanation
        }
        exercises.append(exercise)
    
    return exercises

def escape_quotes(text: str) -> str:
    """Escape double quotes in text"""
    return text.replace('"', '\\"').replace('\n', ' ')

def convert_file(file_path: Path, title: str, subtitle: str):
    """Convert a single file"""
    print(f"\n{'='*80}")
    print(f"Converting: {file_path}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not frontmatter_match:
        print(f"❌ No frontmatter found")
        return
    
    frontmatter = frontmatter_match.group(0)
    
    # Extract exercises
    exercises = extract_exercises_from_nested_format(content)
    
    if not exercises:
        print(f"❌ No exercises found")
        return
    
    print(f"✅ Extracted {len(exercises)} exercises")
    
    # Generate exercise lines
    def generate_line(ex):
        german = escape_quotes(ex['german'])
        answers = ', '.join([f'"{escape_quotes(a)}"' for a in ex['correctAnswer']])
        line = f'{{id: {ex["id"]}, german: "{german}", correctAnswer: [{answers}]'
        if ex['explanation']:
            explanation = escape_quotes(ex['explanation'])
            line += f', explanation: "{explanation}"'
        line += '}'
        return line
    
    exercise_lines = [generate_line(ex) for ex in exercises]
    exercises_str = ', '.join(exercise_lines)
    
    # Build new content
    new_content = frontmatter + '\n'
    new_content += 'import { ExerciseTable } from "@/components/exercises/exercise-table";\n'
    new_content += 'import ExerciseComments from "@/components/exercises/ExerciseComments";\n\n'
    new_content += f'# {title}\n\n'
    new_content += f'<ExerciseTable\n'
    new_content += f'  title="{title}"\n'
    new_content += f'  subtitle="{escape_quotes(subtitle)}"\n'
    new_content += f'  exercises={{[{exercises_str}]}}\n'
    new_content += '/>\n\n'
    new_content += '---\n\n'
    new_content += '## Hỏi đáp & Thảo luận 💬\n\n'
    
    # Generate exerciseId from file path
    exercise_id = str(file_path).split('Übungen/')[-1].replace('.mdx', '').replace('/', '-')
    url = f"/b1niveau/übungen/{exercise_id.replace('-', '/')}"
    
    new_content += '<ExerciseComments\n'
    new_content += f'  exerciseId="b1-{exercise_id}"\n'
    new_content += f'  url="{url}"\n'
    new_content += '/>\n'
    
    # Write new content
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✅ Converted successfully!")
    print(f"   - {len(exercises)} exercises")
    print(f"   - Explanations: {sum(1 for ex in exercises if ex['explanation'])}")

def main():
    base_path = Path('/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/Übungen')
    
    files_to_convert = [
        {
            'path': 'verben-mit-praepositionen/teil3.mdx',
            'title': 'B1 Verben mit Präpositionen - Teil 3: Fehlerkorrektur',
            'subtitle': 'Tìm và sửa lỗi sai về động từ đi với giới từ'
        },
        {
            'path': 'doppelkonjunktionen/teil6.mdx',
            'title': 'B1 Doppelkonjunktionen - Teil 6',
            'subtitle': 'Ứng dụng thực tế - Viết câu hoàn chỉnh'
        },
        {
            'path': 'passiv/teil2.mdx',
            'title': 'B1 Passiv - Teil 2',
            'subtitle': 'Passiv Präteritum (Quá khứ bị động)'
        }
    ]
    
    print("\n" + "="*80)
    print("CONVERTING REMAINING 3 B1 ÜBUNGEN FILES")
    print("="*80)
    
    converted = 0
    
    for file_info in files_to_convert:
        file_path = base_path / file_info['path']
        
        if not file_path.exists():
            print(f"\n⚠️  File not found: {file_path}")
            continue
        
        try:
            convert_file(file_path, file_info['title'], file_info['subtitle'])
            converted += 1
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*80)
    print(f"✅ Converted {converted} files")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
