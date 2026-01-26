#!/bin/bash

# Kill any process on port 3007
echo "🔄 Stopping existing server on port 3007..."
lsof -ti:3007 | xargs kill -9 2>/dev/null

# Wait a moment for port to be released
sleep 1

# Start the dev server
echo "🚀 Starting Next.js dev server..."
cd "$(dirname "$0")"
npm run dev
