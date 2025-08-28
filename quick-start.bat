@echo off
echo ========================================
echo CaseClerk AI - Quick Start Setup
echo ========================================
echo.

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo 🔧 Setting up environment...
if not exist .env (
    copy .env.example .env
    echo ✅ Created .env file from template
    echo ⚠️  Please edit .env file with your settings
) else (
    echo ✅ .env file already exists
)

echo.
echo ========================================
echo 🎉 Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit .env file with your settings
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
echo Press any key to start development servers...
pause > nul

echo.
echo 🚀 Starting development servers...
start "CaseClerk Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul
start "CaseClerk Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo 🌐 CaseClerk AI is starting...
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Health:   http://localhost:8000/health
echo ========================================
echo.
echo Both servers are starting in separate windows.
echo Wait a few seconds, then open http://localhost:3000
echo.
pause