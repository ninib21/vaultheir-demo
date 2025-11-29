@echo off
echo ========================================
echo VaultHeir Docker Build Script
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Building Docker images...
docker-compose build --no-cache

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Docker build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Starting containers...
docker-compose up -d

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to start containers!
    pause
    exit /b 1
)

echo.
echo [3/3] Checking container status...
docker-compose ps

echo.
echo ========================================
echo SUCCESS! VaultHeir is now running:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo ========================================
echo.
echo Commands:
echo   Stop:    docker-compose down
echo   Logs:    docker-compose logs -f
echo   Restart: docker-compose restart
echo.
pause
