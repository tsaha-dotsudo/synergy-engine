@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo  Synergy Engine - local dev server
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is not installed or not on PATH.
  echo Download and install from https://nodejs.org and try again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Starting Next.js dev server on http://localhost:3000 ...
echo (Press Ctrl+C in this window to stop)
echo.

start "" http://localhost:3000
call npm run dev

endlocal
