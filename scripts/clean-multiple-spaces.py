#!/usr/bin/env python3
"""
Clean up multiple spaces in exercise strings
"""

import re
from pathlib import Path

def clean_file(file_path: Path):
    """Remove multiple spaces from exercises array"""
    print(f"\nCleaning: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find exercises array
    match = re.search(r'exercises=\{(\[.*?\])\}', content, re.DOTALL)
    if not match:
        print(f"  ⚠️  No exercises array found")
        return False
    
    exercises_str = match.group(1)
    original = exercises_str
    
    # Remove multiple spaces (2 or more) and replace with single space
    exercises_str = re.sub(r' {2,}', ' ', exercises_str)
    
    if exercises_str != original:
        new_content = content.replace(match.group(0), f'exercises={{{exercises_str}}}')
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"  ✅ Cleaned - removed {len(original) - len(exercises_str)} chars")
        return True
    else:
        print(f"  ✓ Already clean")
        return False

def main():
    base_path = Path('/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/Übungen')
    
    # Get all .mdx files recursively
    files_to_clean = list(base_path.rglob('*.mdx'))
    
    print("\n" + "="*80)
    print("CLEANING MULTIPLE SPACES IN B1 ÜBUNGEN FILES")
    print("="*80)
    print(f"Found {len(files_to_clean)} files")
    
    cleaned = 0
    for file_path in sorted(files_to_clean):
        try:
            if clean_file(file_path):
                cleaned += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print("\n" + "="*80)
    print(f"✅ Cleaned {cleaned} files")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
