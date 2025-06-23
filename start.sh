#!/bin/bash

# Simple Blog Post Manager Startup Script
echo "🚀 Starting Simple Blog Post Manager..."

# Check if json-server is installed
if ! command -v json-server &> /dev/null; then
    echo "❌ json-server is not installed."
    echo "📦 Installing json-server globally..."
    npm install -g json-server
fi

# Check if db.json exists
if [ ! -f "db.json" ]; then
    echo "❌ db.json not found. Creating sample database..."
    cat > db.json << EOF
{
  "posts": [
    {
      "id": 1,
      "title": "Welcome to Your Blog",
      "content": "This is your first blog post. Click the '+ Add New Post' button to create more posts!",
      "author": "Gibson",
      "image": "https://via.placeholder.com/600x200",
      "date": "$(date +%Y-%m-%d)"
    }
  ]
}
EOF
    echo "✅ Sample database created."
fi

# Start json-server
echo "🌐 Starting json-server on http://localhost:3000..."
echo "📝 API endpoints:"
echo "   GET    http://localhost:3000/posts"
echo "   POST   http://localhost:3000/posts"
echo "   PATCH  http://localhost:3000/posts/:id"
echo "   DELETE http://localhost:3000/posts/:id"
echo ""
echo "🌍 Open index.html in your browser to use the application."
echo "🧪 Run BlogPostManagerTests.runAllTests() in the browser console to test."
echo ""
echo "Press Ctrl+C to stop the server."

json-server --watch db.json --port 3000 