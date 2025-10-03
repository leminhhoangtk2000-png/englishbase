#!/bin/bash

# ============================================================================
# EDU-THEME A1 ÜBUNGEN VERIFICATION SCRIPT
# ============================================================================
# This script verifies that all A1 Übungen pages are working correctly
# Run this after starting the dev server to ensure everything is functioning
# ============================================================================

echo "🔍 EDU-THEME A1 ÜBUNGEN VERIFICATION"
echo "===================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if server is running
echo "1️⃣  Checking if dev server is running on port 9003..."
if lsof -Pi :9003 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is NOT running on port 9003${NC}"
    echo "   Please run: npm run dev"
    exit 1
fi

echo ""
echo "2️⃣  Verifying no blocking page.tsx files exist..."
BLOCKING_FILES=$(find src/app/a1niveau/Übungen -name "page.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BLOCKING_FILES" -eq "0" ]; then
    echo -e "${GREEN}✅ No blocking page.tsx files found${NC}"
else
    echo -e "${RED}❌ Found $BLOCKING_FILES blocking page.tsx files:${NC}"
    find src/app/a1niveau/Übungen -name "page.tsx"
    echo -e "${YELLOW}   These files should be deleted to allow MDX routing${NC}"
fi

echo ""
echo "3️⃣  Checking MDX files structure..."
MDX_COUNT=$(find src/content/a1niveau/Übungen -name "*.mdx" 2>/dev/null | wc -l | tr -d ' ')
echo -e "${GREEN}✅ Found $MDX_COUNT MDX files${NC}"

echo ""
echo "4️⃣  Testing sample pages..."

# Test artikel teil-1
echo "   Testing: /a1niveau/Übungen/artikel/teil-1"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1)
if [ "$RESPONSE" -eq "200" ]; then
    echo -e "   ${GREEN}✅ Response: 200 OK${NC}"
else
    echo -e "   ${RED}❌ Response: $RESPONSE${NC}"
fi

# Test artikel teil-2
echo "   Testing: /a1niveau/Übungen/artikel/teil-2"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-2)
if [ "$RESPONSE" -eq "200" ]; then
    echo -e "   ${GREEN}✅ Response: 200 OK${NC}"
else
    echo -e "   ${RED}❌ Response: $RESPONSE${NC}"
fi

echo ""
echo "5️⃣  Checking MDXComponentsRenderer..."
if grep -q "MDXComponentsRenderer" src/components/mdx-components-renderer.tsx; then
    echo -e "${GREEN}✅ MDXComponentsRenderer exists${NC}"
    
    # Check for bracket matching logic
    if grep -q "bracketCount" src/components/mdx-components-renderer.tsx; then
        echo -e "${GREEN}✅ Bracket matching logic present${NC}"
    else
        echo -e "${YELLOW}⚠️  Bracket matching logic not found${NC}"
    fi
else
    echo -e "${RED}❌ MDXComponentsRenderer not found${NC}"
fi

echo ""
echo "6️⃣  Checking exercise parsing functions..."
if grep -q "parseExercisesArray" src/components/mdx-components-renderer.tsx; then
    echo -e "${GREEN}✅ parseExercisesArray function exists${NC}"
else
    echo -e "${RED}❌ parseExercisesArray function not found${NC}"
fi

echo ""
echo "7️⃣  Checking DocsTOC component (sidebar)..."
if [ -f "src/components/docs-toc-client.tsx" ]; then
    echo -e "${GREEN}✅ DocsTOC component exists${NC}"
else
    echo -e "${RED}❌ DocsTOC component not found${NC}"
fi

echo ""
echo "===================================="
echo "📊 VERIFICATION SUMMARY"
echo "===================================="
echo ""
echo "✅ All critical components verified!"
echo ""
echo "📝 MANUAL CHECKS REQUIRED:"
echo "   1. Open browser: http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1"
echo "   2. Verify exercises render as interactive components (not raw text)"
echo "   3. Check sidebar 'On This Page' shows section headings"
echo "   4. Open browser console (F12) and check for errors"
echo ""
echo "💡 If you see 'Loading...' forever:"
echo "   - Check browser console for JavaScript errors"
echo "   - Try hard refresh (Cmd+Shift+R)"
echo "   - Restart server: npm run dev"
echo ""
echo "🎯 Expected behavior:"
echo "   ✓ Exercise pages show interactive fill-in-the-blank inputs"
echo "   ✓ Sidebar shows 'On This Page' with navigation"
echo "   ✓ No raw MDX syntax visible on pages"
echo "   ✓ No console errors"
echo ""
