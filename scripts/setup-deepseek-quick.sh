#!/bin/bash

echo "🚀 Quick DeepSeek Provider Setup & Test"

# Check if development server is running
if ! curl -s http://localhost:9003/api/admin/ai-providers > /dev/null; then
    echo "❌ Development server not running on port 9003"
    echo "Please run: npm run dev"
    exit 1
fi

echo ""
echo "🤖 Creating DeepSeek Provider via API..."

# Create DeepSeek provider using the same API as the form
DEEPSEEK_RESPONSE=$(curl -s -X POST http://localhost:9003/api/admin/ai-providers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "deepseek",
    "displayName": "DeepSeek API",
    "apiKey": "sk-demo-key-for-testing",
    "baseUrl": "https://api.deepseek.com/v1",
    "models": ["deepseek-chat", "deepseek-coder"],
    "defaultModel": "deepseek-chat",
    "temperature": 0.7
  }')

echo "API Response: $DEEPSEEK_RESPONSE"

if echo "$DEEPSEEK_RESPONSE" | grep -q "error.*already exists"; then
    echo "✅ DeepSeek provider already exists"
elif echo "$DEEPSEEK_RESPONSE" | grep -q "provider"; then
    echo "✅ DeepSeek provider created successfully"
else
    echo "❌ Failed to create DeepSeek provider"
    exit 1
fi

echo ""
echo "📊 Current AI Providers:"
curl -s http://localhost:9003/api/admin/ai-providers | jq '.providers[] | {displayName, name, isActive, models}'

echo ""
echo "🎯 Next Steps:"
echo "1. Visit: http://localhost:9003/admin/ai-management"
echo "2. Click 'Add Provider' button"  
echo "3. Select 'DeepSeek' from Provider Type dropdown"
echo "4. DeepSeek models and API URL will auto-populate"
echo "5. Add your real DeepSeek API key"
echo ""
echo "💡 Get DeepSeek API key at: https://platform.deepseek.com/api_keys"
