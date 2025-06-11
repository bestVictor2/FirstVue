const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

async function main() {
  // 交互式输入账号密码
  const answers = await inquirer.prompt([
    { type: 'input', name: 'user', message: '请输入MySQL用户名:', default: 'root' },
    { type: 'password', name: 'password', message: '请输入MySQL密码:', mask: '*' }
  ]);

  // 写入 .env 文件
  const envContent = `DB_USER=${answers.user}\nDB_PASSWORD=${answers.password}\nDB_NAME=vuedb\n`;
  fs.writeFileSync(path.join(__dirname, 'server', '.env'), envContent);

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: answers.user,
    password: answers.password,
    multipleStatements: true
  });

  // 创建数据库
  await connection.query('CREATE DATABASE IF NOT EXISTS vuedb;');
  await connection.query('USE vuedb;');

  // 读取并执行建表语句
  const schemaPath = path.join(__dirname, 'server', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');
  await connection.query(schema);

  console.log('数据库初始化完成！');
  await connection.end();
}

main().catch(err => {
  console.error('数据库初始化失败:', err);
  process.exit(1);
});