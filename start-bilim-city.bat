@echo off
title Bilim City server
cd /d "%~dp0"
"C:\Program Files\nodejs\node.exe" "node_modules\next\dist\bin\next" dev --port 3000
pause
