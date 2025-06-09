// 引入 express 框架
const express = require('express')
// 创建路由对象
const router = express.Router()
// 引入数据库连接
const db = require('../db')

// 添加卡片接口
// 路径：POST /card/addcard
// 参数：cardnumber, username, password
router.post('/addcard', (req, res) => {
    // 从请求体中解构获取参数
    const { cardnumber, username, password } = req.body
    // 校验参数是否完整
    if (!cardnumber || !username || !password) {
        return res.status(400).json({ error: 'fail' })
    }
    // 插入卡片信息到数据库，balance 和 created_at 用默认值
    const sql = 'INSERT INTO card (cardnumber, username, password) VALUES (?, ?, ?)'
    const value = [cardnumber, username, password]
    db.query(sql, value, (err, result) => {
        if (err) {
            console.log('fail')
            return res.status(500).json({ error: 'fail' })
        }
        // 返回插入成功的响应和新卡片的 id
        res.json({ success: true, message: '添加成功', id: result.insertId })
    })
})

// 导出路由对象
module.exports = router