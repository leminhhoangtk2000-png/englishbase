#!/bin/bash

# ============================================================================
# FINAL SYSTEM HEALTH CHECK - A1 ÜBUNGEN
# ============================================================================

echo "🏥 FINAL SYSTEM HEALTH CHECK"
echo "===================================="
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0;0m'

PASS=0
FAIL=0

echo "1️⃣  Checking server..."
if lsof -Pi :9003 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Server running on port 9003${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Server NOT running${NC}"
    ((FAIL++))
fi

echo ""
echo "2️⃣  Checking for broken imports..."
BROKEN_IMPORTS=$(grep -r "import Exerci<div" src/content/a1niveau/Übungen 2>/dev/null | wc -l | tr -d ' ')
if [ "$BROKEN_IMPORTS" -eq "0" ]; then
    echo -e "${GREEN}✅ No broken imports found${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Found $BROKEN_IMPORTS broken imports${NC}"
    ((FAIL++))
fi

echo ""
echo "3️⃣  Checking for raw import text..."
RAW_IMPORTS=$(grep -r '^m "@/components' src/content/a1niveau/Übungen 2>/dev/null | wc -l | tr -d ' ')
if [ "$RAW_IMPORTS" -eq "0" ]; then
    echo -e "${GREEN}✅ No raw import text found${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Found $RAW_IMPORTS raw import lines${NC}"
    ((FAIL++))
fi

echo ""
echo "4️⃣  Checking for blocking page.tsx files..."
BLOCKING_FILES=$(find src/app/a1niveau/Übungen -name "page.tsx" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BLOCKING_FILES" -eq "0" ]; then
    echo -e "${GREEN}✅ No blocking files${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Found $BLOCKING_FILES blocking files${NC}"
    ((FAIL++))
fi

echo ""
echo "5️⃣  Testing sample pages..."
declare -a SAMPLE_URLS=(
  "http://localhost:9003/a1niveau/%C3%9Cbungen/ubungsfragen/teil-3"
  "http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1"
  "http://localhost:9003/a1niveau/%C3%9Cbungen/perfekt-ubungen/teil1"
)

SAMPLE_PASS=0
for url in "${SAMPLE_URLS[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$STATUS" -eq "200" ]; then
    ((SAMPLE_PASS++))
  fi
done

if [ "$SAMPLE_PASS" -eq "${#SAMPLE_URLS[@]}" ]; then
    echo -e "${GREEN}✅ All sample pages accessible (${SAMPLE_PASS}/${#SAMPLE_URLS[@]})${NC}"
    ((PASS++))
else
    echo -e "${YELLOW}⚠️  Some pages failed (${SAMPLE_PASS}/${#SAMPLE_URLS[@]})${NC}"
    ((FAIL++))
fi

echo ""
echo "6️⃣  Checking for PLACEHOLDER errors..."
PLACEHOLDER_COUNT=$(curl -s http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1 | grep -c "EXERCISE_PLACEHOLDER" || echo "0")
if [ "$PLACEHOLDER_COUNT" -eq "0" ]; then
    echo -e "${GREEN}✅ No placeholder errors${NC}"
    ((PASS++))
else
    echo -e "${RED}❌ Found $PLACEHOLDER_COUNT placeholders in rendered HTML${NC}"
    ((FAIL++))
fi

echo ""
echo "7️⃣  Checking backup files..."
BACKUP_COUNT=$(find src/content/a1niveau/Übungen -name "*.backup" 2>/dev/null | wc -l | tr -d ' ')
if [ "$BACKUP_COUNT" -gt "0" ]; then
    echo -e "${YELLOW}⚠️  Found $BACKUP_COUNT backup files (can be deleted if everything works)${NC}"
else
    echo -e "${GREEN}✅ No backup files${NC}"
fi

echo ""
echo "===================================="
echo "📊 FINAL SCORE"
echo "===================================="
echo -e "${GREEN}✅ Passed: $PASS${NC}"
if [ "$FAIL" -gt "0" ]; then
  echo -e "${RED}❌ Failed: $FAIL${NC}"
  echo ""
  echo "⚠️  System needs attention!"
else
  echo -e "${GREEN}❌ Failed: $FAIL${NC}"
  echo ""
  echo "🎉 SYSTEM IS HEALTHY!"
  echo ""
  echo "✅ All checks passed!"
  echo "✅ Exercises render correctly"
  echo "✅ No broken imports"
  echo "✅ No placeholder errors"
  echo ""
  if [ "$BACKUP_COUNT" -gt "0" ]; then
    echo "💡 You can safely delete backup files:"
    echo "   find src/content/a1niveau/Übungen -name '*.backup' -delete"
  fi
fi

echo ""
