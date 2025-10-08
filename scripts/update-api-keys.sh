#!/bin/bash

# Script to update AI provider API keys from environment variables

echo "🔑 Updating AI Provider API Keys..."

# Check if development server is running
if ! curl -s http://localhost:9003/api/admin/ai-providers > /dev/null; then
    echo "❌ Development server not running on port 9003"
    echo "Please run: npm run dev"
    exit 1
fi

# Update OpenAI API Key
if [ ! -z "$OPENAI_API_KEY" ]; then
    echo "📡 Updating OpenAI API Key..."
    curl -s -X PUT http://localhost:9003/api/admin/ai-providers/openai/apikey \
        -H "Content-Type: application/json" \
        -d '{"apiKey":"'$OPENAI_API_KEY'"}' > /dev/null
    echo "✅ OpenAI API Key updated"
else
    echo "⚠️  OPENAI_API_KEY not found in environment"
fi

# Update Gemini API Key
if [ ! -z "$GOOGLE_GENAI_API_KEY" ]; then
    echo "📡 Updating Gemini API Key..."
    curl -s -X PUT http://localhost:9003/api/admin/ai-providers/gemini/apikey \
        -H "Content-Type: application/json" \
        -d '{"apiKey":"'$GOOGLE_GENAI_API_KEY'"}' > /dev/null
    echo "✅ Gemini API Key updated"
else
    echo "⚠️  GOOGLE_GENAI_API_KEY not found in environment"
fi

# Update DeepSeek API Key
if [ ! -z "$DEEPSEEK_API_KEY" ]; then
    echo "📡 Updating DeepSeek API Key..."
    curl -s -X PUT http://localhost:9003/api/admin/ai-providers/deepseek/apikey \
        -H "Content-Type: application/json" \
        -d '{"apiKey":"'$DEEPSEEK_API_KEY'"}' > /dev/null
    echo "✅ DeepSeek API Key updated"
else
    echo "⚠️  DEEPSEEK_API_KEY not found in environment"
fi

echo ""
echo "🎉 API Key update completed!"
echo "💡 To test the providers, visit: http://localhost:9003/admin/ai-management"
