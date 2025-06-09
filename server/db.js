// db.js
// 引入 mysql2 模块
const mysql = require('mysql2')

// 创建数据库连接对象，配置数据库信息
const connection = mysql.createConnection({
  host: "localhost",      // 数据库主机地址
  port: 3306,              // 数据库端口
  user: "root",           // 数据库用户名
  password: "root",       // 数据库密码
  database: "vuedb"        // 要连接的数据库名
})

// 连接数据库，并输出连接状态
connection.connect((err) => {
  if (err) {
    console.error("数据库连接失败:", err)
  } else {
    console.log("数据库连接成功！")
  }
})

// 导出连接对象，供其他模块使用
module.exports = connection