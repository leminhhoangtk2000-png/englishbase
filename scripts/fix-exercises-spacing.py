#!/usr/bin/env python3
"""
Fix spacing issues in exercises array - remove spaces after [ and trailing commas
"""

import re
from pathlib import Path

def fix_file_spacing(file_path: Path):
    """Fix spacing in exercises array"""
    print(f"\nFixing: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find exercises array
    match = re.search(r'exercises=\{(\[.*?\])\}', content, re.DOTALL)
    if not match:
        print(f"  ⚠️  No exercises array found")
        return False
    
    exercises_str = match.group(1)
    original = exercises_str
    
    # Fix: Remove space after [
    exercises_str = re.sub(r'\[\s+\{', '[{', exercises_str)
    
    # Fix: Remove space before ]
    exercises_str = re.sub(r',\s+\]', ']', exercises_str)
    
    # Fix: Remove space after { 
    exercises_str = re.sub(r'\{\s+id', '{id', exercises_str)
    
    # Fix: Remove trailing comma and space before }
    exercises_str = re.sub(r',\s*\}', '}', exercises_str)
    
    # Fix: Remove space between }, and {
    exercises_str = re.sub(r'\},\s+\{', '}, {', exercises_str)
    
    if exercises_str != original:
        new_content = content.replace(match.group(0), f'exercises={{{exercises_str}}}')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Fixed spacing issues")
        return True
    else:
        print(f"  ✓ Already correct")
        return False

def main():
    base_path = Path('/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/Übungen')
    
    files_to_fix = [
        'verben-mit-praepositionen/teil1.mdx',
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
    print("FIXING SPACING IN B1 ÜBUNGEN EXERCISES ARRAYS")
    print("="*80)
    
    fixed = 0
    for file_rel_path in files_to_fix:
        file_path = base_path / file_rel_path
        if file_path.exists():
            try:
                if fix_file_spacing(file_path):
                    fixed += 1
            except Exception as e:
                print(f"  ❌ Error: {e}")
    
    print("\n" + "="*80)
    print(f"✅ Fixed {fixed} files")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
