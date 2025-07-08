# Start Development Environment Script
# This script starts both backend and frontend applications

Write-Host "Starting Indian Trade Mart Development Environment..." -ForegroundColor Green

# Start Backend
Write-Host "Starting Backend (Spring Boot)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\itech-backend\itech-backend'; .\mvnw.cmd spring-boot:run"

# Wait a moment for backend to start
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "Starting Frontend (React)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\IndianTradeMart-main'; npm run itm"

Write-Host "Development environment started!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Press any key to exit..." -ForegroundColor Yellow
Read-Host
