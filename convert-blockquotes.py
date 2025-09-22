#!/usr/bin/env python3
"""
Convert all blockquotes to admonition notes in markdown files
"""

import os
import re
import glob

def convert_blockquotes_to_admonitions(content):
    """Convert blockquotes to admonition notes"""
    
    # Pattern to match multi-line blockquotes
    # Matches: > content\n> more content\n> etc.
    blockquote_pattern = r'^((?:>\s.*\n?)+)'
    
    def replace_blockquote(match):
        blockquote_content = match.group(1)
        
        # Remove > symbols and leading spaces
        lines = []
        for line in blockquote_content.split('\n'):
            if line.strip():
                # Remove > and any following space
                cleaned_line = re.sub(r'^>\s?', '', line)
                lines.append(cleaned_line)
        
        # Join the content
        inner_content = '\n'.join(lines)
        
        # Extract title from first meaningful line
        first_line = lines[0] if lines else ""
        
        # Clean up title (remove emoji, markdown formatting)
        title = re.sub(r'[💡📌🚀✨⚡🎯]', '', first_line).strip()
        title = re.sub(r'\*\*([^*]+)\*\*', r'\1', title)  # Remove bold
        title = title[:50] if title else "Ghi chú"  # Limit title length
        
        if not title or title in ['', '💡', '📌']:
            title = "Ghi chú"
        
        # Create admonition
        admonition = f":::note[{title}]\n{inner_content}\n:::"
        
        return admonition
    
    # Apply the conversion
    converted = re.sub(blockquote_pattern, replace_blockquote, content, flags=re.MULTILINE)
    
    return converted

def process_file(file_path):
    """Process a single markdown file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Convert blockquotes to admonitions
        converted_content = convert_blockquotes_to_admonitions(content)
        
        # Only write if content changed
        if converted_content != content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(converted_content)
            print(f"✅ Converted: {file_path}")
            return True
        else:
            print(f"⏭️  No changes: {file_path}")
            return False
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    """Main conversion function"""
    # Find all markdown files in content directory
    content_dir = "src/content"
    md_files = glob.glob(f"{content_dir}/**/*.md", recursive=True)
    
    print(f"🔍 Found {len(md_files)} markdown files")
    
    converted_count = 0
    for file_path in md_files:
        if process_file(file_path):
            converted_count += 1
    
    print(f"\n🎉 Conversion complete!")
    print(f"📝 Files processed: {len(md_files)}")
    print(f"✅ Files converted: {converted_count}")

if __name__ == "__main__":
    main()
