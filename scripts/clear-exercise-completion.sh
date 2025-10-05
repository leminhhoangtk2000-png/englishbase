#!/bin/bash

# Script to clear exercise completion for testing
# Usage: ./scripts/clear-exercise-completion.sh "exerciseId"

if [ -z "$1" ]; then
  echo "❌ Error: Please provide exerciseId"
  echo "Usage: ./scripts/clear-exercise-completion.sh \"a1/Horen/Familie und Freunde Teil 1 - A1\""
  exit 1
fi

EXERCISE_ID="$1"

echo "🗑️  Clearing completion for: $EXERCISE_ID"

docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "DELETE FROM exercise_completions WHERE \"exerciseId\" = '$EXERCISE_ID';"

echo "✅ Done! Refresh browser to see completion button again."
