#!/bin/bash

# 🧹 Project Cleanup Script
# Removes temporary files, logs, and unused scripts before production build

echo "🧹 Starting project cleanup..."
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Counter for deleted items
DELETED_COUNT=0

# Function to delete files with confirmation
delete_files() {
    local pattern=$1
    local description=$2
    
    echo -e "${YELLOW}🔍 Checking for ${description}...${NC}"
    
    if [ -n "$pattern" ]; then
        local files=$(eval "find . -name '$pattern' 2>/dev/null")
        if [ -n "$files" ]; then
            echo "$files"
            local count=$(echo "$files" | wc -l)
            DELETED_COUNT=$((DELETED_COUNT + count))
            eval "find . -name '$pattern' -delete 2>/dev/null"
            echo -e "${GREEN}✅ Deleted ${count} file(s)${NC}"
        else
            echo "   No files found"
        fi
    fi
    echo ""
}

# 1. Delete log files
echo "=== Cleaning Log Files ==="
if ls *.log 1> /dev/null 2>&1; then
    echo "Found log files:"
    ls -lh *.log
    rm -f *.log
    echo -e "${GREEN}✅ Deleted log files${NC}"
    DELETED_COUNT=$((DELETED_COUNT + 1))
else
    echo "   No log files found"
fi
echo ""

# 2. Delete backup files
delete_files "*.backup" "backup files"
delete_files "*.old" "old files"

# 3. Delete temporary files
delete_files "*.tmp" "temporary files"
delete_files "*.temp" "temp files"
delete_files "*~" "editor backup files"

# 4. Delete Python cache
echo "=== Cleaning Python Cache ==="
if [ -d "__pycache__" ] || find . -name "*.pyc" -o -name "*.pyo" | grep -q .; then
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null
    find . -name "*.pyc" -delete 2>/dev/null
    find . -name "*.pyo" -delete 2>/dev/null
    echo -e "${GREEN}✅ Deleted Python cache${NC}"
    DELETED_COUNT=$((DELETED_COUNT + 1))
else
    echo "   No Python cache found"
fi
echo ""

# 5. Check for unused Python scripts (optional - list only)
echo "=== Checking Python Scripts ==="
echo "Python scripts in root directory:"
ls -1 *.py 2>/dev/null || echo "   No Python scripts found"
echo ""
echo -e "${YELLOW}⚠️  Consider removing unused Python scripts if any${NC}"
echo ""

# 6. Check for unused shell scripts (optional - list only)
echo "=== Checking Shell Scripts ==="
echo "Shell scripts in root directory:"
ls -1 *.sh 2>/dev/null | grep -v "fix-frameborder.sh" || echo "   No shell scripts found"
echo ""
echo -e "${YELLOW}⚠️  Consider consolidating or removing unused scripts${NC}"
echo ""

# 7. Clean Next.js build artifacts
echo "=== Cleaning Next.js Cache ==="
if [ -d ".next" ]; then
    echo "Removing .next directory..."
    rm -rf .next
    echo -e "${GREEN}✅ Deleted .next cache${NC}"
    DELETED_COUNT=$((DELETED_COUNT + 1))
else
    echo "   No .next directory found"
fi
echo ""

# 8. List markdown documentation files (for review)
echo "=== Documentation Files ==="
echo "Current markdown files in root:"
ls -1 *.md 2>/dev/null | head -20
echo ""
DOC_COUNT=$(ls -1 *.md 2>/dev/null | wc -l)
echo "Total: $DOC_COUNT markdown files"
echo ""
echo -e "${YELLOW}💡 Consider organizing docs into /docs folder if needed${NC}"
echo ""

# 9. Check node_modules size
echo "=== Checking Dependencies ==="
if [ -d "node_modules" ]; then
    SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo "node_modules size: $SIZE"
else
    echo "   No node_modules found"
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✅ Cleanup Complete!${NC}"
echo "=================================="
echo ""
echo "📊 Summary:"
echo "   Items cleaned: $DELETED_COUNT"
echo ""
echo "📝 Next steps:"
echo "   1. Review any remaining files manually"
echo "   2. Run: npm run build"
echo "   3. Test the build"
echo "   4. Commit changes"
echo "   5. Push to repository"
echo ""
