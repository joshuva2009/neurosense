# NeuroSense Public Link Generator
param (
    [string]$Authtoken = ""
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " NeuroSense - Make It Fully Online & Shareable" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$CurrentDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Check if local app is running on port 8000
$conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if (-not $conn) {
    Write-Host "[*] Starting unified server on port 8000..." -ForegroundColor Green
    Start-Process -NoNewWindow -FilePath "python" -ArgumentList "-m uvicorn main:app --host 0.0.0.0 --port 8000" -WorkingDirectory "$CurrentDir\backend"
    Start-Sleep -Seconds 2
}

# Display Local Network Link (for devices on same Wi-Fi)
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*" } | Select-Object -First 1).IPAddress
Write-Host "`n📱 [Local Wi-Fi Network Link]:" -ForegroundColor Cyan
Write-Host "   Anyone on your Wi-Fi can open: http://${localIP}:8000" -ForegroundColor Green

# If ngrok authtoken provided
if ($Authtoken -ne "") {
    Write-Host "`n🌐 Configuring ngrok authtoken..." -ForegroundColor Cyan
    & "$CurrentDir\ngrok.exe" config add-authtoken $Authtoken
}

Write-Host "`n🚀 Launching ngrok public tunnel..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to exit when finished sharing.`n" -ForegroundColor Gray

& "$CurrentDir\ngrok.exe" http 8000
