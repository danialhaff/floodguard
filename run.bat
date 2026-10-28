@echo off
echo ========================================================
echo        Starting FloodGuard System Services
echo ========================================================
echo.

cd /d "%~dp0"

set "PYTHON_EXE=%~dp0backend\.venv\Scripts\python.exe"

if not exist "%PYTHON_EXE%" (
    echo Python virtual environment not found in backend\.venv!
    echo Please ensure the backend virtual environment is set up.
    pause
    exit /b 1
)

echo Starting Backend API (FastAPI on port 8000)...
start "FloodGuard Backend API" /min "%PYTHON_EXE%" -m uvicorn main:app --app-dir "%~dp0backend" --host 0.0.0.0 --port 8000

echo Starting Frontend Web Server (port 3000)...
start "FloodGuard Frontend" /min "%PYTHON_EXE%" -m http.server 3000 --directory "%~dp0frontend"

timeout /t 2 >nul

echo.
echo FloodGuard is running!
echo   - Public Dashboard:      http://localhost:3000/
echo   - Alternative Access:    http://localhost:8000/frontend/
echo   - Responder Portal:      http://localhost:3000/responder.html
echo   - Admin Portal:          http://localhost:3000/admin.html
echo   - Backend Swagger Docs:  http://localhost:8000/docs
echo.
start http://localhost:3000/
