@echo off
echo Fetching latest code...
git fetch --all
git reset --hard origin/main
git pull origin main
echo Installing dependencies...
npm install
echo Restarting development server...
taskkill /F /IM node.exe 
start cmd /k "npm run dev"
echo Update completed!
pause