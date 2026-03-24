# PowerShell script to start the development server
# This helps work around path issues with special characters

Write-Host "Starting Zero Waste Management Frontend..." -ForegroundColor Green
Write-Host "Working directory: $PWD" -ForegroundColor Yellow

# Clear npm cache if needed
Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Recurse -Force "node_modules/.vite"
}

# Set environment variables
$env:VITE_API_BASE_URL = "http://localhost:5000/api"

# Start the development server
Write-Host "Starting Vite development server..." -ForegroundColor Green
npm run dev