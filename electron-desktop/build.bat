@echo off
echo ========================================
echo VaultHeir Electron Build Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing Electron dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo [2/4] Building Next.js application...
cd ..
call npm run build

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Next.js build failed!
    pause
    exit /b 1
)

cd electron-desktop

echo.
echo [3/4] Building Windows executable...
call npm run build:win

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Electron build failed!
    pause
    exit /b 1
)

echo.
echo [4/4] Build complete!
echo.
echo ========================================
echo SUCCESS! Built files are in: dist/
echo ========================================
echo.
dir dist\*.exe 2>nul
echo.
pause
