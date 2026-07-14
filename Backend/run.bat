@echo off
echo ==========================================
echo   MailGenie Backend Launcher
echo ==========================================
echo.
cd /d "%~dp0email-writer-s"
echo Running maven spring-boot:run inside email-writer-s...
mvn spring-boot:run
