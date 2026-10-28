Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       Starting FloodGuard System Services" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonExe = Join-Path $ScriptDir "backend\.venv\Scripts\python.exe"

if (-not (Test-Path $PythonExe)) {
    Write-Host "Error: Python virtual environment not found in backend\.venv!" -ForegroundColor Red
    exit 1
}

Write-Host "Starting Backend API (FastAPI on port 8000)..." -ForegroundColor Yellow
Start-Process -FilePath $PythonExe -ArgumentList "-m uvicorn main:app --app-dir `"$ScriptDir\backend`" --host 0.0.0.0 --port 8000" -WindowStyle Minimized

Write-Host "Starting Frontend Web Server (port 3000)..." -ForegroundColor Yellow
Start-Process -FilePath $PythonExe -ArgumentList "-m http.server 3000 --directory `"$ScriptDir\frontend`"" -WindowStyle Minimized

Start-Sleep -Seconds 2

Write-Host "`nFloodGuard is running!" -ForegroundColor Green
Write-Host "  - Public Dashboard:      http://localhost:3000/" -ForegroundColor White
Write-Host "  - Alternative Access:    http://localhost:8000/frontend/" -ForegroundColor White
Write-Host "  - Responder Portal:      http://localhost:3000/responder.html" -ForegroundColor White
Write-Host "  - Admin Portal:          http://localhost:3000/admin.html" -ForegroundColor White
Write-Host "  - Backend Swagger Docs:  http://localhost:8000/docs" -ForegroundColor White

Start-Process "http://localhost:3000/"
