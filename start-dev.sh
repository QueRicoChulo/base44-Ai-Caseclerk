#!/bin/bash

echo "🚀 Starting CaseClerk AI Development Environment..."
echo ""

# Install root dependencies
echo "📦 Installing dependencies..."
npm install

# Function to check if port is available
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check ports
if ! check_port 8000; then
    echo "❌ Backend port 8000 is in use. Please free the port and try again."
    exit 1
fi

if ! check_port 3000; then
    echo "❌ Frontend port 3000 is in use. Please free the port and try again."
    exit 1
fi

# Start backend in background
echo "🔧 Starting Backend Server (Port 8000)..."
cd backend
npm install
npm run dev &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 5

# Start frontend in background
echo "🎨 Starting Frontend Server (Port 3000)..."
cd frontend
npm install
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================="
echo "🎉 CaseClerk AI Development Environment"
echo "========================================="
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo "Health:   http://localhost:8000/health"
echo "========================================="
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait