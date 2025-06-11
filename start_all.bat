@echo off
REM Install root dependencies
echo Installing root dependencies...
npm uninstall inquirer
npm install inquirer@8 mysql2 dotenv

REM Install backend dependencies
echo Installing backend dependencies...
cd server
npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd client/vue-project-client
npm install
cd ../..

REM Initialize database (will prompt for DB username and password)
echo Initializing database...
node init_db.js
IF %ERRORLEVEL% NEQ 0 (
  echo Database initialization failed, stopped!
  pause
  exit /b %ERRORLEVEL%
)

REM Start backend
echo Starting backend...
start cmd /k "cd server && node index.js"

REM Start frontend
echo Starting frontend...
start cmd /k "cd client/vue-project-client && npm run dev"

REM Open frontend in browser
start http://localhost:5173

echo All services started!
pause