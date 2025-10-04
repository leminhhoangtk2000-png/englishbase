#!/usr/bin/env python3
"""
Fix exercise imports from Docusaurus (@site/src) to Next.js (@/components)
"""

import os
import re
from pathlib import Path

# Base path
EXERCISES_DIR = Path("src/content/exercises")

# Mapping from old imports to new imports
IMPORT_MAPPINGS = {
    # Quiz components
    "import MultipleChoiceQuiz from '@site/src/components/Quiz/MultipleChoiceQuiz/MultipleChoiceQuiz';": 
        "import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';",
    
    "import Lueckentext from '@site/src/components/Quiz/Lueckentext/Lueckentext';": 
        "import { Lueckentext } from '@/components/ui/lueckentext';",
    
    "import TrueFalseQuiz from '@site/src/components/Quiz/TrueFalseQuiz/TrueFalseQuiz';": 
        "import { TrueFalseQuiz } from '@/components/exercises/true-false-quiz';",
    
    "import MatchingQuiz from '@site/src/components/Quiz/MatchingQuiz/MatchingQuiz';":
        "import MatchingQuiz from '@/components/exercises/matching-quiz';",
    
    "import Satzbildung from '@site/src/components/Quiz/Satzbildung/Satzbildung';":
        "import Satzbildung from '@/components/exercises/satzbildung';",
    
    "import { ExerciseTable } from '@site/src/components/exercises/exercise-table';":
        "import { ExerciseTable } from '@/components/exercises/exercise-table';",
    
    # Special components
    "import AuthorCredit from '@site/src/components/Special/AuthorCredit/AuthorCredit';":
        "import { AuthorCredit } from '@/components/ui/author-credit';",
    
    # Remove FacebookComments
    "import FacebookComments from '@site/src/components/Forms/FacebookComments/FacebookComments';":
        "",
}

# Also remove usage of FacebookComments
USAGE_REMOVALS = [
    r'<FacebookComments\s+[^>]*/>',
    r'<FacebookComments>.*?</FacebookComments>',
]

def fix_file(file_path: Path) -> bool:
    """Fix imports in a single file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix imports
        for old_import, new_import in IMPORT_MAPPINGS.items():
            if old_import in content:
                content = content.replace(old_import, new_import)
        
        # Remove FacebookComments usage
        for pattern in USAGE_REMOVALS:
            content = re.sub(pattern, '', content, flags=re.DOTALL)
        
        # Clean up multiple blank lines
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
    
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
        return False

def main():
    """Main function to fix all exercise files"""
    print("🔧 Fixing exercise imports...")
    print(f"📂 Directory: {EXERCISES_DIR}\n")
    
    fixed_count = 0
    total_count = 0
    
    # Find all .mdx files
    for mdx_file in EXERCISES_DIR.rglob("*.mdx"):
        total_count += 1
        if fix_file(mdx_file):
            fixed_count += 1
            print(f"✅ Fixed: {mdx_file.relative_to(EXERCISES_DIR)}")
    
    print(f"\n📊 Summary:")
    print(f"   Total files: {total_count}")
    print(f"   Fixed files: {fixed_count}")
    print(f"   Unchanged: {total_count - fixed_count}")
    
    if fixed_count > 0:
        print(f"\n✨ Successfully fixed {fixed_count} files!")
    else:
        print(f"\n✓ No files needed fixing!")

if __name__ == "__main__":
    main()
