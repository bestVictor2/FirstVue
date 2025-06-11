@echo off
REM 安装根目录依赖
npm install inquirer mysql2

REM 初始化数据库
node init_db.js
IF %ERRORLEVEL% NEQ 0 (
  echo 数据库初始化失败，已终止！
  exit /b %ERRORLEVEL%
)

REM 启动后端
start cmd /k "cd server && npm install && npm run dev"

REM 启动前端
start cmd /k "cd client/vue-project-client && npm install && npm run dev"

echo 所有服务已启动！
pause