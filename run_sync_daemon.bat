@echo off
title LabSphere Git Auto-Sync Daemon
echo ========================================================
echo   Starting LabSphere Git Auto-Sync Daemon...
echo   Any manual component or quantity edit made in LabSphere
echo   will be automatically committed and pushed to GitHub!
echo ========================================================
echo.
python scripts/git_sync_daemon.py
if errorlevel 1 (
    C:\Users\USER\.platformio\penv\Scripts\python.exe scripts/git_sync_daemon.py
)
pause
