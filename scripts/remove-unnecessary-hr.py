#!/usr/bin/env python3
"""
Script to remove unnecessary --- (horizontal rules) from A1 Übungen MDX files
Keeps frontmatter --- but removes content --- separators
"""

import re
import sys
from pathlib import Path

def remove_unnecessary_hr(file_path: Path) -> bool:
    """Remove unnecessary --- from MDX content (keep frontmatter)"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        lines = content.split('\n')
        new_lines = []
        in_frontmatter = False
        frontmatter_count = 0
        
        for i, line in enumerate(lines):
            # Track frontmatter boundaries
            if line.strip() == '---':
                if i == 0 or frontmatter_count == 1:
                    # This is frontmatter start or end
                    frontmatter_count += 1
                    new_lines.append(line)
                    continue
                elif frontmatter_count < 2:
                    # Still in frontmatter
                    frontmatter_count += 1
                    new_lines.append(line)
                    continue
                else:
                    # This is a content separator - SKIP IT
                    # But keep the blank line effect by checking context
                    continue
            else:
                new_lines.append(line)
        
        # Clean up excessive blank lines (more than 2 consecutive)
        cleaned_lines = []
        blank_count = 0
        for line in new_lines:
            if line.strip() == '':
                blank_count += 1
                if blank_count <= 2:
                    cleaned_lines.append(line)
            else:
                blank_count = 0
                cleaned_lines.append(line)
        
        new_content = '\n'.join(cleaned_lines)
        
        # Check if anything changed
        if new_content != original_content:
            file_path.write_text(new_content, encoding='utf-8')
            return True
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}", file=sys.stderr)
        return False

def main():
    """Main function to process all A1 Übungen MDX files"""
    root = Path(__file__).parent.parent / "src" / "content" / "a1niveau" / "Übungen"
    
    if not root.exists():
        print(f"❌ Directory not found: {root}")
        sys.exit(1)
    
    mdx_files = list(root.rglob("*.mdx"))
    print(f"🔍 Found {len(mdx_files)} MDX files in A1 Übungen")
    print()
    
    cleaned_count = 0
    for mdx_file in sorted(mdx_files):
        if remove_unnecessary_hr(mdx_file):
            rel_path = mdx_file.relative_to(root)
            print(f"✅ Cleaned: {rel_path}")
            cleaned_count += 1
    
    print()
    print(f"✨ Cleaned {cleaned_count} files (removed content --- separators)")
    print(f"✓ Kept frontmatter --- in all files")

if __name__ == "__main__":
    main()
