@echo off
echo ================================
echo   EMPORIO BOTHÂNICO - NGROK
echo ================================
echo.
echo Iniciando tuneis ngrok...
echo.

start "Backend Ngrok" cmd /k "cd /d C:\Users\joaov\loja && ngrok.exe http 3001 --log=stdout"
timeout /t 3 /nobreak >nul

start "Frontend Ngrok" cmd /k "cd /d C:\Users\joaov\loja && ngrok.exe http 3000 --log=stdout"

echo.
echo Tuneis iniciados!
echo.
echo Aguarde alguns segundos e acesse:
echo https://dashboard.ngrok.com/endpoints
echo.
echo Para ver as URLs publicas da sua loja!
echo.
pause
