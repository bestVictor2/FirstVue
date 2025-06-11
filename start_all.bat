@echo off
REM Install dependencies in root
echo Installing root dependencies...
npm install inquirer mysql2

REM Initialize database
echo Initializing database...
node init_db.js
IF %ERRORLEVEL% NEQ 0 (
  echo Database initialization failed, stopped!
  exit /b %ERRORLEVEL%
)

REM Start backend
echo Starting backend...
start cmd /k "cd server && npm install && npm run dev"

REM Start frontend
echo Starting frontend...
start cmd /k "cd client/vue-project-client && npm install && npm run dev"

echo All services started!
pause