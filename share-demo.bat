@echo off
echo ========================================
echo VaultHeir - Share Demo with Investors
echo ========================================
echo.
echo Starting local server...
start cmd /k "cd /d C:\vaultheir-demo && npm run dev"
echo.
echo Waiting for server to start...
timeout /t 10 /nobreak
echo.
echo Creating public URL with ngrok...
echo.
echo SHARE THE URL BELOW WITH INVESTORS:
echo ========================================
ngrok http 3000
