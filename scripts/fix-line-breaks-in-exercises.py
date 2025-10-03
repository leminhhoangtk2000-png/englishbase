#!/usr/bin/env python3
"""
Fix line breaks in explanation strings that break MDX parser
"""

import re
from pathlib import Path

def fix_file(file_path: Path):
    """Remove line breaks within string values in exercises array"""
    print(f"\n{'='*80}")
    print(f"Fixing: {file_path.name}")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the exercises array
    match = re.search(r'exercises=\{(\[.*?\])\}', content, re.DOTALL)
    if not match:
        print(f"⚠️  No exercises array found")
        return False
    
    exercises_str = match.group(1)
    original_length = len(exercises_str)
    
    # Remove line breaks and extra whitespace within the exercises array
    # But preserve the single-line format
    fixed_str = re.sub(r'\n\s+', ' ', exercises_str)
    
    # Replace in content
    new_content = content.replace(match.group(0), f'exercises={{{fixed_str}}}')
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    if len(fixed_str) != original_length:
        print(f"✅ Fixed - reduced from {original_length} to {len(fixed_str)} chars")
        return True
    else:
        print(f"✓ Already correct")
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
    print("FIXING LINE BREAKS IN B1 ÜBUNGEN FILES")
    print("="*80)
    
    fixed_count = 0
    
    for file_rel_path in files_to_fix:
        file_path = base_path / file_rel_path
        
        if not file_path.exists():
            print(f"\n⚠️  File not found: {file_path}")
            continue
        
        try:
            if fix_file(file_path):
                fixed_count += 1
        except Exception as e:
            print(f"\n❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "="*80)
    print(f"✅ Fixed {fixed_count} files")
    print("="*80 + "\n")

if __name__ == '__main__':
    main()
