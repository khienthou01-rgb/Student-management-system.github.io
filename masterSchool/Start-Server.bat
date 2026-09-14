@echo off
title MasterSchool - ប្រព័ន្ធគ្រប់គ្រងសិស្ស
echo ==========================================================
echo    MasterSchool - Local Web Server
echo    Running at: http://localhost:8080/
echo ==========================================================
start http://localhost:8080/
where node >nul 2>nul
if %ERRORLEVEL% equ 0 (
    node "%~dp0server.js"
) else (
    powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve.ps1"
)
pause
