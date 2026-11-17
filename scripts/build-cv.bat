@echo off
REM Rebuilds the CV PDF (assets/cv/Nayemur-Rahman-CV.pdf) from the JSON files in data/.
REM Run this after changing data/*.json. Needs Python and Microsoft Edge or Google Chrome.
cd /d "%~dp0.."
python scripts\build-cv.py
pause
