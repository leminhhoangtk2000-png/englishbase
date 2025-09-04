#!/bin/bash

echo "🧪 Testing Word Limit Feature for Vocabulary Search"
echo "=================================================="
echo ""

# Test valid cases (1-3 words)
echo "✅ Testing VALID cases (1-3 words):"
echo "------------------------------------"

echo "1️⃣ Testing 1 word: 'Buch'"
RESPONSE=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Buch"}')
if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ 1 word: SUCCESS"
else
  echo "❌ 1 word: FAILED"
fi

echo ""
echo "2️⃣ Testing 2 words: 'Der Stift'"
RESPONSE2=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Der Stift"}')
if echo "$RESPONSE2" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ 2 words: SUCCESS"
else
  echo "❌ 2 words: FAILED"
fi

echo ""
echo "3️⃣ Testing 3 words: 'Der schöne Stift'"
RESPONSE3=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Der schöne Stift"}')
if echo "$RESPONSE3" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ 3 words: SUCCESS"
else
  echo "❌ 3 words: FAILED"
fi

echo ""
echo ""

# Test invalid cases (>3 words)
echo "❌ Testing INVALID cases (>3 words):"
echo "------------------------------------"

echo "4️⃣ Testing 4 words: 'Der schöne große Stift'"
RESPONSE4=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Der schöne große Stift"}')
ERROR4=$(echo "$RESPONSE4" | jq -r '.error // "null"')
if [ "$ERROR4" = "Giới hạn tìm kiếm" ]; then
  echo "✅ 4 words: CORRECTLY REJECTED"
  echo "   Message: $(echo "$RESPONSE4" | jq -r '.message')"
else
  echo "❌ 4 words: SHOULD HAVE BEEN REJECTED"
fi

echo ""
echo "5️⃣ Testing 6 words: 'Der schöne große alte neue Stift'"
RESPONSE5=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Der schöne große alte neue Stift"}')
ERROR5=$(echo "$RESPONSE5" | jq -r '.error // "null"')
if [ "$ERROR5" = "Giới hạn tìm kiếm" ]; then
  echo "✅ 6 words: CORRECTLY REJECTED"
  echo "   Message: $(echo "$RESPONSE5" | jq -r '.message')"
  echo "   Word count: $(echo "$RESPONSE5" | jq -r '.currentWords')/$(echo "$RESPONSE5" | jq -r '.maxWords')"
else
  echo "❌ 6 words: SHOULD HAVE BEEN REJECTED"
fi

echo ""
echo "🎯 Summary:"
echo "- Words 1-3: Should work normally and call AI"
echo "- Words 4+: Should be rejected with friendly message"
echo "- Cost savings: Prevents expensive AI calls for long phrases"
echo ""
echo "✨ Features added:"
echo "- API validation in /api/vocabulary/ai-search/route.ts"
echo "- Frontend error handling with specific toast messages"
echo "- Updated placeholder text: 'tối đa 3 từ'"
echo "- Helper text: '💡 Mẹo: Tìm kiếm tối đa 3 từ trong 1 lần'"
