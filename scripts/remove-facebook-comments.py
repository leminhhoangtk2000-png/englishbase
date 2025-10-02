#!/usr/bin/env python3
"""
Script to remove old FacebookComments imports and usage from MDX files
"""

import re
import sys
from pathlib import Path

def remove_facebook_comments(file_path: Path) -> bool:
    """Remove FacebookComments import and usage from a file"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original_content = content
        
        # Pattern 1: Remove the import line (with any quote style)
        import_pattern = r'import\s+FacebookComments\s+from\s+["\']@site/src/components/Forms/FacebookComments/FacebookComments["\']\s*;\s*\n?'
        content = re.sub(import_pattern, '', content)
        
        # Pattern 2: Remove the component usage line
        component_pattern = r'<FacebookComments\s+url=["\'][^"\']*["\']\s*/>\s*\n?'
        content = re.sub(component_pattern, '', content)
        
        # Pattern 3: Remove any trailing --- separators that are now alone
        # But be careful not to remove frontmatter separators
        lines = content.split('\n')
        cleaned_lines = []
        for i, line in enumerate(lines):
            # Skip empty lines followed by standalone ---
            if line.strip() == '---' and i > 0:
                # Check if previous non-empty line is also ---
                prev_non_empty = None
                for j in range(i-1, -1, -1):
                    if lines[j].strip():
                        prev_non_empty = lines[j].strip()
                        break
                
                # If we're at the end and the previous content is substantial, keep it
                if i == len(lines) - 1 or (i == len(lines) - 2 and not lines[-1].strip()):
                    # This is a trailing separator, likely leftover from removal
                    # Only keep it if there's actual content before it
                    if prev_non_empty and prev_non_empty != '---':
                        cleaned_lines.append(line)
                else:
                    cleaned_lines.append(line)
            else:
                cleaned_lines.append(line)
        
        content = '\n'.join(cleaned_lines)
        
        # Remove excessive blank lines (more than 2 consecutive)
        content = re.sub(r'\n{4,}', '\n\n\n', content)
        
        # Check if anything changed
        if content != original_content:
            file_path.write_text(content, encoding='utf-8')
            return True
        return False
        
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}", file=sys.stderr)
        return False

def main():
    """Main function to process all MDX files"""
    if len(sys.argv) > 1:
        # Process specific file
        file_path = Path(sys.argv[1])
        if file_path.exists() and file_path.suffix == '.mdx':
            if remove_facebook_comments(file_path):
                print(f"✅ Cleaned: {file_path}")
            else:
                print(f"⏭️  No changes needed: {file_path}")
        else:
            print(f"❌ Invalid file: {file_path}")
            sys.exit(1)
    else:
        # Process all MDX files
        root = Path(__file__).parent.parent / "src" / "content"
        mdx_files = list(root.rglob("*.mdx"))
        
        print(f"🔍 Found {len(mdx_files)} MDX files")
        
        cleaned_count = 0
        for mdx_file in mdx_files:
            if remove_facebook_comments(mdx_file):
                print(f"✅ Cleaned: {mdx_file.relative_to(root.parent)}")
                cleaned_count += 1
        
        print(f"\n✨ Cleaned {cleaned_count} files")

if __name__ == "__main__":
    main()
