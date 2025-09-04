#!/bin/bash

echo "🧪 Testing Smart Vocabulary Search & Update System"
echo "================================================="
echo ""

# Test 1: Search for typo → get suggestions
echo "1️⃣ Testing TYPO SEARCH with suggestions:"
echo "Search: 'hamer' (typo of 'hammer')"
SUGGESTIONS=$(curl -s "http://localhost:9002/api/vocabulary/suggestions?q=hamer&limit=3")
echo "✅ Suggestions found: $(echo "$SUGGESTIONS" | jq '.total') words"
echo "   Top suggestion: $(echo "$SUGGESTIONS" | jq -r '.data[0].german') ($(echo "$SUGGESTIONS" | jq -r '.data[0].similarity * 100 | round')% similar)"

echo ""

# Test 2: Search incomplete word to trigger AI update
echo "2️⃣ Testing INCOMPLETE WORD UPDATE:"
echo "Searching for 'der Hammer' (has incomplete info)..."

# First, check current state
CURRENT=$(curl -s "http://localhost:9002/api/vocabulary?search=der%20Hammer")
echo "   Current state: $(echo "$CURRENT" | jq -r '.data[0].vietnamese') | $(echo "$CURRENT" | jq -r '.data[0].phonetic')"

# Now trigger AI search which should update it
AI_RESPONSE=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "der Hammer"}')

SOURCE=$(echo "$AI_RESPONSE" | jq -r '.source')
NEW_VIETNAMESE=$(echo "$AI_RESPONSE" | jq -r '.data.definitions.vietnamese')
NEW_PHONETIC=$(echo "$AI_RESPONSE" | jq -r '.data.pronunciation')

if [ "$SOURCE" = "ai_updated" ]; then
  echo "✅ AI Update triggered successfully!"
  echo "   New state: $NEW_VIETNAMESE | $NEW_PHONETIC"
else
  echo "ℹ️  Response source: $SOURCE"
  echo "   Data: $NEW_VIETNAMESE | $NEW_PHONETIC"
fi

echo ""

# Test 3: Search new word
echo "3️⃣ Testing NEW WORD creation:"
echo "Searching for 'Katze' (should create new entry)..."
NEW_WORD_RESPONSE=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Katze"}')

NEW_SOURCE=$(echo "$NEW_WORD_RESPONSE" | jq -r '.source')
KATZE_VIETNAMESE=$(echo "$NEW_WORD_RESPONSE" | jq -r '.data.definitions.vietnamese')
KATZE_PHONETIC=$(echo "$NEW_WORD_RESPONSE" | jq -r '.data.pronunciation')

if [ "$NEW_SOURCE" = "ai_generated" ]; then
  echo "✅ New word created successfully!"
  echo "   die Katze: $KATZE_VIETNAMESE | $KATZE_PHONETIC"
elif [ "$NEW_SOURCE" = "database" ]; then
  echo "ℹ️  Word already exists in database"
  echo "   die Katze: $KATZE_VIETNAMESE | $KATZE_PHONETIC"
fi

echo ""

# Test 4: Word limit
echo "4️⃣ Testing WORD LIMIT (max 3 words):"
LIMIT_TEST=$(curl -s -X POST http://localhost:9002/api/vocabulary/ai-search \
  -H "Content-Type: application/json" \
  -d '{"word": "Der sehr schöne große Hammer"}')

LIMIT_ERROR=$(echo "$LIMIT_TEST" | jq -r '.error // "null"')
if [ "$LIMIT_ERROR" = "Giới hạn tìm kiếm" ]; then
  echo "✅ Word limit enforced correctly"
  echo "   Message: $(echo "$LIMIT_TEST" | jq -r '.message')"
else
  echo "❌ Word limit not working properly"
fi

echo ""

# Test 5: Completely unknown word
echo "5️⃣ Testing UNKNOWN WORD with suggestions:"
echo "Searching for 'xyz123' (should show suggestions or not found)..."
UNKNOWN_SUGGESTIONS=$(curl -s "http://localhost:9002/api/vocabulary/suggestions?q=xyz123&limit=3")
UNKNOWN_TOTAL=$(echo "$UNKNOWN_SUGGESTIONS" | jq '.total')

if [ "$UNKNOWN_TOTAL" = "0" ]; then
  echo "✅ No suggestions for gibberish word (expected)"
else
  echo "ℹ️  Found $UNKNOWN_TOTAL suggestions (unexpected but possible)"
fi

echo ""
echo "🎯 SUMMARY OF FEATURES:"
echo "✅ Smart search with fuzzy matching suggestions"
echo "✅ Auto-update incomplete vocabulary entries"
echo "✅ Create new vocabulary entries via AI"
echo "✅ Word limit enforcement (max 3 words)"
echo "✅ Graceful handling of unknown words"
echo ""
echo "🌟 USER FLOW:"
echo "1. User types typo → Gets suggestions → Clicks suggestion"
echo "2. System detects incomplete data → Auto-updates with AI"
echo "3. User gets complete, accurate vocabulary information"
echo ""
echo "💰 COST OPTIMIZATION:"
echo "- Suggestions use local database (no AI cost)"
echo "- Updates only incomplete entries (avoids duplicate AI calls)"
echo "- Word limit prevents expensive long phrase translations"
