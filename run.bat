@echo off
title SchemeSathi Prototype Launcher
echo ========================================================
echo   Launching SchemeSathi Prototype...
echo ========================================================
cd /d "%~dp0"
start http://localhost:8000
python server.py
pause
