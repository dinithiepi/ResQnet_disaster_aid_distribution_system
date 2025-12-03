# ResQNet Startup Script for PowerShell
# Run this script from the root directory of the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ResQNet Disaster Aid System" -ForegroundColor Cyan
Write-Host "   Starting All Services..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Function to start a service in a new window
function Start-Service {
    param (
        [string]$ServiceName,
        [string]$ServicePath,
        [int]$Port
    )
    
    Write-Host "Starting $ServiceName on port $Port..." -ForegroundColor Green
    
    $scriptBlock = {
        param($path, $name)
        Set-Location $path
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "   $name" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan
        npm start
    }
    
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$ServicePath'; Write-Host '========================================' -ForegroundColor Cyan; Write-Host '   $ServiceName' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; npm start}"
    
    Start-Sleep -Seconds 2
}

# Get the current directory
$rootDir = Get-Location

# Start Backend Services
Write-Host ""
Write-Host "Starting Backend Services..." -ForegroundColor Yellow
Write-Host ""

$gatewayPath = Join-Path $rootDir "backend\disaster-aid-backend\gateway"
Start-Service -ServiceName "Gateway Service" -ServicePath $gatewayPath -Port 4001

$adminPath = Join-Path $rootDir "backend\disaster-aid-backend\admin-service"
Start-Service -ServiceName "Admin Service" -ServicePath $adminPath -Port 4002

$managerPath = Join-Path $rootDir "backend\disaster-aid-backend\manager-service"
Start-Service -ServiceName "Manager Service" -ServicePath $managerPath -Port 4003

$inventoryPath = Join-Path $rootDir "backend\disaster-aid-backend\inventory-service"
Start-Service -ServiceName "Inventory Service" -ServicePath $inventoryPath -Port 4004

# Wait for services to initialize
Write-Host ""
Write-Host "Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host ""
Write-Host "Starting Frontend Application..." -ForegroundColor Yellow
Write-Host ""

$frontendPath = Join-Path $rootDir "disaster-aid-system"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {Set-Location '$frontendPath'; Write-Host '========================================' -ForegroundColor Cyan; Write-Host '   Frontend Application' -ForegroundColor Cyan; Write-Host '========================================' -ForegroundColor Cyan; npm run dev}"

Start-Sleep -Seconds 3

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "   All Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Services Running:" -ForegroundColor Cyan
Write-Host "  - Gateway Service:    http://localhost:4001" -ForegroundColor White
Write-Host "  - Admin Service:      http://localhost:4002" -ForegroundColor White
Write-Host "  - Manager Service:    http://localhost:4003" -ForegroundColor White
Write-Host "  - Inventory Service:  http://localhost:4004" -ForegroundColor White
Write-Host "  - Frontend:           http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  - Main Site:          http://localhost:5173" -ForegroundColor Yellow
Write-Host "  - Admin Portal:       http://localhost:5173/admin/login" -ForegroundColor Yellow
Write-Host "  - Manager Portal:     http://localhost:5173/manager/login" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop services" -ForegroundColor Gray
Write-Host ""
Write-Host "Tip: Check each terminal window for service status" -ForegroundColor Gray
Write-Host ""

# Open browser after a delay
Start-Sleep -Seconds 3
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "System is ready! Happy managing! 🎉" -ForegroundColor Green
