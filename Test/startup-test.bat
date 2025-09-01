@echo off
echo Running Catalyst HR Management System Startup Test...
echo.

rem Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

rem Run the startup test
node startup-test.js

rem Check if the test succeeded
if %ERRORLEVEL% neq 0 (
    echo.
    echo Startup test completed with errors.
    echo Please check the output above for details.
) else (
    echo.
    echo Startup test completed successfully!
)

echo.
pause
