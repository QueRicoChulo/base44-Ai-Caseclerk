@echo off
echo Starting CaseClerk AI Development Environment...
echo.

echo Installing dependencies...
call npm install

echo.
echo Starting Backend Server (Port 8000)...
start "CaseClerk Backend" cmd /k "cd backend && npm install && npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server (Port 3000)...
start "CaseClerk Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================
echo CaseClerk AI Development Environment
echo ========================================
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8000
echo Health:   http://localhost:8000/health
echo ========================================
echo.
echo Both servers are starting in separate windows...
echo Press any key to exit this window.
pause > nul