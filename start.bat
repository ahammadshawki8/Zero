@echo off
echo Starting Zero Waste Management Frontend...
echo.

REM Clear Vite cache
if exist "node_modules\.vite" (
    echo Clearing Vite cache...
    rmdir /s /q "node_modules\.vite"
)

REM Set environment variables
set VITE_API_BASE_URL=http://localhost:5000/api

REM Start development server
echo Starting development server...
npm run dev

pause