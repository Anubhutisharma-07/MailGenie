@echo off
title MailGenie Launcher

:menu
cls
echo ===================================================
echo               💌 MailGenie Launcher
echo ===================================================
echo.
echo Please choose an option:
echo [1] Start Spring Boot Backend
echo [2] Start React Frontend
echo [3] Start Both (Launches in separate windows)
echo [4] Exit
echo.
set /p choice="Enter option (1-4): "

if "%choice%"=="1" goto run_backend
if "%choice%"=="2" goto run_frontend
if "%choice%"=="3" goto run_both
if "%choice%"=="4" goto end
echo Invalid option. Press any key to return to menu...
pause >nul
goto menu

:run_backend
cls
echo Starting Spring Boot Backend...
cd /d "%~dp0Backend\email-writer-s"
mvn spring-boot:run
pause
goto menu

:run_frontend
cls
echo Starting React Frontend...
cd /d "%~dp0frontend\EmailwriterGenerator"
npm run dev
pause
goto menu

:run_both
cls
echo Launching Spring Boot Backend in a new window...
start cmd /k "title MailGenie Backend && cd /d "%~dp0Backend\email-writer-s" && mvn spring-boot:run"
echo Launching React Frontend in a new window...
start cmd /k "title MailGenie Frontend && cd /d "%~dp0frontend\EmailwriterGenerator" && npm run dev"
echo.
echo Both services have been launched in separate console windows.
echo Press any key to return to the menu...
pause >nul
goto menu

:end
exit
