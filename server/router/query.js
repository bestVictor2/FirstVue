// 引入 express 框架
const express = require('express')
// 创建路由对象
const router = express.Router()
// 引入数据库连接
const db = require('../db')

// 查询卡片接口
// 路径：GET /card/query
// 参数：cardnumber
router.get('/query', (req, res) => {
    const { cardnumber } = req.query
    if (!cardnumber) {
        return res.status(400).json({ success: false, error: '卡号不能为空' })
    }
    // 查询卡片信息
    const sql = 'SELECT cardnumber, username, balance, created_at FROM card WHERE cardnumber = ? LIMIT 1'
    db.query(sql, [cardnumber], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: '数据库查询失败' })
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, error: '未找到该卡片' })
        }
        res.json({ success: true, card: results[0] })
    })
})

// 导出路由对象
module.exports = router 