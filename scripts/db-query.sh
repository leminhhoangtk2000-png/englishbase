#!/bin/bash
# Quick database query script - Alternative to Prisma Studio

echo "🗄️  Database Query Tool"
echo "======================="
echo ""

# Function to run queries
run_query() {
  docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "$1"
}

# Main menu
case "$1" in
  "users")
    echo "📋 All Users:"
    run_query "SELECT id, email, name, role FROM users;"
    ;;
  "completions")
    echo "✅ Exercise Completions:"
    run_query "SELECT * FROM exercise_completions ORDER BY \"completedAt\" DESC LIMIT 20;"
    ;;
  "ratings")
    echo "⭐ Exercise Ratings:"
    run_query "SELECT * FROM exercise_ratings ORDER BY \"createdAt\" DESC LIMIT 20;"
    ;;
  "stats")
    echo "📊 Database Statistics:"
    echo ""
    echo "Users:"
    run_query "SELECT COUNT(*) as total FROM users;"
    echo ""
    echo "Completions:"
    run_query "SELECT COUNT(*) as total FROM exercise_completions;"
    echo ""
    echo "Ratings:"
    run_query "SELECT COUNT(*) as total FROM exercise_ratings;"
    ;;
  "tables")
    echo "📁 All Tables:"
    run_query "\dt"
    ;;
  "interactive")
    echo "🔍 Opening interactive psql..."
    docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db
    ;;
  *)
    echo "Usage: ./scripts/db-query.sh [command]"
    echo ""
    echo "Commands:"
    echo "  users         - List all users"
    echo "  completions   - List exercise completions"
    echo "  ratings       - List exercise ratings"
    echo "  stats         - Show database statistics"
    echo "  tables        - List all tables"
    echo "  interactive   - Open interactive psql"
    echo ""
    echo "Example: ./scripts/db-query.sh users"
    ;;
esac
