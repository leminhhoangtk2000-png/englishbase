#!/usr/bin/env python3
"""
Convert B1 Übungen from nested component format to props-based ExerciseTable format
with explanation support and single-line format for MDX parser compatibility.
"""

import re
from pathlib import Path

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
        
        # Convert answer to array format if it contains multiple words
        if ' / ' in answer:
            # Handle "hätte / würde" format
            answers = [a.strip() for a in answer.split(' / ')]
        elif ' ' in answer and not answer.startswith('['):
            # Multiple words without separator - treat as array
            answers = [answer]
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
    return text.replace('"', '\\"')

def generate_exercise_line(exercise: dict) -> str:
    """Generate single-line exercise object"""
    german = escape_quotes(exercise['german'])
    answers = exercise['correctAnswer']
    
    # Format correctAnswer array
    answer_str = ', '.join([f'"{escape_quotes(a)}"' for a in answers])
    
    line = f'{{id: {exercise["id"]}, german: "{german}", correctAnswer: [{answer_str}]'
    
    if exercise['explanation']:
        explanation = escape_quotes(exercise['explanation'])
        line += f', explanation: "{explanation}"'
    
    line += '}'
    
    return line

def convert_file(file_path: Path):
    """Convert a single file from nested to props format"""
    print(f"\n{'='*80}")
    print(f"Converting: {file_path.name}")
    print(f"{'='*80}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
    if not frontmatter_match:
        print(f"⚠️  No frontmatter found in {file_path.name}")
        return
    
    frontmatter = frontmatter_match.group(0)
    rest_content = content[len(frontmatter):]
    
    # Extract title and instruction sections
    title_match = re.search(r'^# (.*?)$', rest_content, re.MULTILINE)
    title = title_match.group(1) if title_match else "Exercise"
    
    # Extract instruction if exists
    instruction_match = re.search(r'<ExerciseInstruction>\s*(.*?)\s*</ExerciseInstruction>', rest_content, re.DOTALL)
    instruction = instruction_match.group(1).strip() if instruction_match else None
    
    # Clean instruction (remove extra whitespace)
    if instruction:
        instruction = re.sub(r'\s+', ' ', instruction)
    
    # Extract theory section if exists (before ExerciseTable)
    theory_match = re.search(r'(##.*?)(?=<ExerciseTable>)', rest_content, re.DOTALL)
    theory_section = theory_match.group(1).strip() if theory_match else ""
    
    # Extract exercises
    exercises = extract_exercises_from_nested_format(rest_content)
    
    if not exercises:
        print(f"⚠️  No exercises found in {file_path.name}")
        return
    
    print(f"✅ Extracted {len(exercises)} exercises")
    
    # Generate new format
    exercise_lines = [generate_exercise_line(ex) for ex in exercises]
    exercises_str = ', '.join(exercise_lines)
    
    # Build new content
    new_content = frontmatter + '\n'
    new_content += 'import { ExerciseTable } from "@/components/exercises/exercise-table";\n'
    new_content += 'import ExerciseComments from "@/components/exercises/ExerciseComments";\n\n'
    new_content += f'# {title}\n\n'
    
    if theory_section:
        new_content += theory_section + '\n\n'
    
    # Determine subtitle
    if instruction:
        subtitle = instruction
    else:
        subtitle = "Hoàn thành các bài tập sau"
    
    # Extract exercise title from frontmatter
    title_match = re.search(r'title:\s*"([^"]+)"', frontmatter)
    exercise_title = title_match.group(1) if title_match else title
    
    new_content += '<ExerciseTable\n'
    new_content += f'  title="{exercise_title}"\n'
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
    # Define files to convert
    base_path = Path('/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/Übungen')
    
    files_to_convert = [
        'verben-mit-praepositionen/teil2.mdx',
        'relativsatze/teil1.mdx',
        'konjunktiv-ii/teil1.mdx',
        'doppelkonjunktionen/teil1.mdx',
        'doppelkonjunktionen/teil2.mdx',
        'doppelkonjunktionen/teil3.mdx',
        'doppelkonjunktionen/teil4.mdx',
        'doppelkonjunktionen/teil5.mdx',
        'adjektive/teil1.mdx',
        'adjektive/teil2.mdx',
        'adjektive/teil3.mdx',
        'praepositionen/teil1.mdx',
        'praepositionen/teil2.mdx',
        'praepositionen/teil3.mdx',
        'artikelwoerter-pronomen/teil1.mdx',
        'artikelwoerter-pronomen/teil2.mdx',
    ]
    
    print("\n" + "="*80)
    print("B1 ÜBUNGEN CONVERSION TO PROPS FORMAT WITH EXPLANATION")
    print("="*80)
    print(f"Total files to convert: {len(files_to_convert)}")
    
    converted = 0
    failed = 0
    
    for file_rel_path in files_to_convert:
        file_path = base_path / file_rel_path
        
        if not file_path.exists():
            print(f"\n⚠️  File not found: {file_path}")
            failed += 1
            continue
        
        try:
            convert_file(file_path)
            converted += 1
        except Exception as e:
            print(f"\n❌ Error converting {file_path.name}: {e}")
            import traceback
            traceback.print_exc()
            failed += 1
    
    print("\n" + "="*80)
    print("CONVERSION SUMMARY")
    print("="*80)
    print(f"✅ Converted: {converted}")
    print(f"❌ Failed: {failed}")
    print(f"📊 Total: {len(files_to_convert)}")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
