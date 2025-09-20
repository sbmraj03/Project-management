@echo off
echo Testing local build...
echo.

echo [1/4] Installing dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/4] Checking build output...
if not exist "dist\index.html" (
    echo ERROR: dist/index.html not found
    pause
    exit /b 1
)

echo.
echo [4/4] Starting preview server...
echo Build successful! Starting preview server...
echo Open http://localhost:4173 in your browser
echo Press Ctrl+C to stop the server
call npm run preview

pause
