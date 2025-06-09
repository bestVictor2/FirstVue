// 引入 express 框架
const express = require('express')
const router = express.Router()
const db = require('../db')

// 上机接口
// 路径：POST /card/login
// 参数：cardnumber, password
router.post('/login', (req, res) => {
    const { cardnumber, password } = req.body
    if (!cardnumber || !password) {
        return res.status(400).json({ success: false, error: '卡号和密码不能为空' })
    }
    // 校验卡号和密码
    db.query('SELECT * FROM card WHERE cardnumber = ? AND password = ?', [cardnumber, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        if (results.length === 0) return res.status(401).json({ success: false, error: '卡号或密码错误' })
        // 记录上机时间
        const now = new Date()
        db.query('INSERT INTO login_log (cardnumber, login_time) VALUES (?, ?)', [cardnumber, now], (err2) => {
            if (err2) return res.status(500).json({ success: false, error: '记录上机失败' })
            res.json({ success: true, login_time: now })
        })
    })
})

module.exports = router 