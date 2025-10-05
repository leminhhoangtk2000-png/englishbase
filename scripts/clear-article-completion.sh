#!/bin/bash

# Script to clear article completion for testing
# Usage: ./scripts/clear-article-completion.sh "articleId"

if [ -z "$1" ]; then
  echo "❌ Error: Please provide articleId"
  echo "Usage: ./scripts/clear-article-completion.sh \"test-article-1\""
  exit 1
fi

ARTICLE_ID="$1"

echo "🗑️  Clearing article completion for: $ARTICLE_ID"

docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "DELETE FROM \"articleCompletion\" WHERE \"articleId\" = '$ARTICLE_ID';"

echo "✅ Done! Refresh browser to see completion button again."
