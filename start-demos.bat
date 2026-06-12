@echo off
rem Double-click this to start the demo kit server and open it in your browser.
cd /d "%~dp0"
start "Kaohsiung demos server" /min node serve.js
timeout /t 1 /nobreak >nul
start "" "http://localhost:4173"
