// 引入 express 框架
const express = require('express')
// 引入跨域中间件，允许前端跨域请求
const cors = require('cors')
// 引入 body-parser 处理请求体数据
const bodyParser = require('body-parser')
// 引入自定义的卡片路由
const cardRouter = require('./router/card.js')
// 引入卡片查询路由
const queryRouter = require('./router/query.js')
// 引入上机路由
const loginRouter = require('./router/login.js')
// 引入下机路由
const logoutRouter = require('./router/logout.js')
const rechargeRouter = require('./router/recharge.js')
const refundRouter = require('./router/refund.js')
const deleteCardRouter = require('./router/deletecard.js')
const statRouter = require('./router/stat.js')

// 创建 express 应用实例
const app = express()
// 设置服务端口
const port = 3000

// 使用 CORS 中间件，允许跨域请求
app.use(cors())
// 使用 body-parser 解析 JSON 格式的请求体
app.use(bodyParser.json())
// 使用 body-parser 解析 urlencoded 格式的请求体
app.use(bodyParser.urlencoded({ extended: false }))

// 挂载卡片相关路由，所有 /card 路径的请求交给 cardRouter 处理
app.use('/card', cardRouter)
// 挂载卡片查询路由
app.use('/card', queryRouter)
// 挂载上机路由
app.use('/card', loginRouter)
// 挂载下机路由
app.use('/card', logoutRouter)
app.use('/card', rechargeRouter)
app.use('/card', refundRouter)
app.use('/card', deleteCardRouter)
app.use('/stat', statRouter)

// 启动服务器，监听指定端口
app.listen(port, () => {
  console.log(`服务器已启动，监听端口 ${port}`)
})