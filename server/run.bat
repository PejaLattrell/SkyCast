@echo off
echo SkyCast Python ETL Server
echo ─────────────────────────────────────
echo.

REM Check Python is available (try py launcher first, then direct path)
set PYTHON_CMD=
py -3.11 --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=py -3.11
    goto python_found
)
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    goto python_found
)
if exist "%LOCALAPPDATA%\Programs\Python\Python311\python.exe" (
    set "PYTHON_CMD=%LOCALAPPDATA%\Programs\Python\Python311\python.exe"
    set "PATH=%LOCALAPPDATA%\Programs\Python\Python311;%LOCALAPPDATA%\Programs\Python\Python311\Scripts;%PATH%"
    goto python_found
)
echo ERROR: Python not found. Install Python 3.11+ from https://python.org
pause
exit /b 1
:python_found
echo Found Python: %PYTHON_CMD%

REM Check .env exists
if not exist ".env" (
    echo ERROR: .env file not found.
    echo Copy .env.example to .env and fill in your Supabase credentials.
    echo.
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
%PYTHON_CMD% -m pip install -r requirements.txt

echo.
echo Starting server on http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo.
%PYTHON_CMD% -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
