# NeuroSense Launch Script
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " NeuroSense - Early Detection & Monitoring of Brain Health" -ForegroundColor Yellow
Write-Host " University Design Thinking Project" -ForegroundColor Magenta
Write-Host "==========================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Python FastAPI Backend
Write-Host "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Green
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn main:app --host 127.0.0.1 --port 8000" -WorkingDirectory "$CurrentDir\backend"

Start-Sleep -Seconds 2

# 2. Start Vite Frontend
Write-Host "[2/2] Starting Vite Frontend on http://127.0.0.1:5173..." -ForegroundColor Green
Start-Process -FilePath "npm" -ArgumentList "run dev -- --host 127.0.0.1 --port 5173" -WorkingDirectory "$CurrentDir\frontend"

Write-Host "`n✓ NeuroSense Web Application is live!" -ForegroundColor Cyan
Write-Host "👉 Open your browser to: http://127.0.0.1:5173" -ForegroundColor Yellow
