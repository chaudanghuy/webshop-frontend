@echo off
git pull origin main
start cmd /k "npm run dev"
timeout /t 2
start http://localhost:3000