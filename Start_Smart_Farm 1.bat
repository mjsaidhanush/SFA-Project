@echo off
title Smart Farm Assistant Server
echo ===================================================
echo     SMART FARM ASSISTANT - UNIFIED STARTUP
echo ===================================================
echo.
echo Starting all servers in the background of this ONE window...
echo.clear

echo [1/3] Starting Backend Server (Node.js)...
start /B cmd /c "cd C:\Users\MJSAIDHANUSH\.gemini\antigravity\scratch\smart-farm-assistant\backend && node src\server.js"

echo [2/3] Starting AI Machine Learning Services (Python)...
start /B cmd /c "cd C:\Users\MJSAIDHANUSH\.gemini\antigravity\scratch\smart-farm-assistant\ml-services && .\venv\Scripts\activate && uvicorn main:app --host 0.0.0.0 --port 8000"

echo [3/3] Starting Frontend Web App (React)...
start /B cmd /c "cd C:\Users\MJSAIDHANUSH\.gemini\antigravity\scratch\smart-farm-assistant\frontend && npm run dev"

echo.
echo Please wait about 10 seconds for the servers to boot and React to compile...
timeout /t 10 /nobreak >nul

echo.
echo Launching the Smart Farm App!
start http://localhost:3000

echo.
echo ============================================================
echo   Done! Your app is now open in your default web browser. 
echo   DO NOT close this terminal window, as it is quietly
echo   keeping your entire Smart Farm system running!
echo.
echo   (To quit the Smart Farm later, just Close this window)
echo ============================================================
echo.
echo SERVER LOGS WILL APPEAR BELOW:
echo ------------------------------------------------------------
