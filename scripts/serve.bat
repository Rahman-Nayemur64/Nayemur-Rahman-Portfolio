@echo off
REM Starts a local web server for the portfolio and opens it in the browser.
REM Needed because browsers block loading the JSON data files when index.html is opened straight from disk.
REM Uses Python if installed, otherwise Node.js (npx). Press Ctrl+C to stop.

cd /d "%~dp0.."
set PORT=8000

where python >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%
  python -m http.server %PORT%
  goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
  start "" http://localhost:%PORT%
  npx --yes http-server -p %PORT% -c-1
  goto :eof
)

echo Neither Python nor Node.js was found.
echo Install one of them, or use the "Live Server" extension in VS Code (right-click index.html, "Open with Live Server").
pause
