#!/usr/bin/env python3
"""
Script to convert multi-line ExerciseTable format to single-line format
"""
import re
import sys

def convert_exercises_to_single_line(content):
    """Convert multi-line exercises format to single-line"""
    
    # Pattern to match multi-line exercise blocks
    pattern = r'exercises=\{\[\s*\n((?:\s*\{\s*\n(?:[^}]*\n)*\s*\},?\s*\n)*)\s*\]\}'
    
    def process_exercise_block(match):
        block = match.group(1)
        
        # Extract individual exercises
        exercise_pattern = r'\{\s*\n\s*id:\s*(\d+),\s*\n\s*german:\s*"([^"]*)",\s*\n\s*correctAnswer:\s*\[(.*?)\],\s*\n\s*\}'
        
        exercises = []
        for ex_match in re.finditer(exercise_pattern, block, re.MULTILINE | re.DOTALL):
            id_num = ex_match.group(1)
            german = ex_match.group(2)
            answers = ex_match.group(3).strip()
            
            # Format as single line
            exercises.append(f'{{id: {id_num}, german: "{german}", correctAnswer: [{answers}]}}')
        
        # Join all exercises into single-line format
        return 'exercises={[' + ', '.join(exercises) + ']}'
    
    # Replace all exercise blocks
    result = re.sub(pattern, process_exercise_block, content, flags=re.MULTILINE | re.DOTALL)
    
    return result

def main():
    input_file = sys.argv[1]
    
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Convert format
    converted = convert_exercises_to_single_line(content)
    
    # Write back
    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(converted)
    
    print(f"✅ Converted {input_file} to single-line format")

if __name__ == '__main__':
    main()
