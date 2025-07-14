@echo off
echo Generating project tree...
powershell -ExecutionPolicy Bypass -NoLogo -File "%~dp0project_tree.ps1"
echo.
echo Done! Output saved to project_tree.txt
pause
