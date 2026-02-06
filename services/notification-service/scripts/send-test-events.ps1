# PowerShell script to send test events
# Run this in Windows PowerShell

$KAFKA_BROKER = "172.26.63.222:9092"

Write-Host "🚀 Using TypeScript producer to send events..." -ForegroundColor Green
Write-Host ""

# Just run the existing TypeScript script
npx ts-node scripts/trigger-event.ts
