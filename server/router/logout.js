// 引入 express 框架
const express = require('express')
const router = express.Router()
const db = require('../db')

// 下机接口
// 路径：POST /card/logout
// 参数：cardnumber, password
router.post('/logout', (req, res) => {
    const { cardnumber, password } = req.body
    if (!cardnumber || !password) {
        return res.status(400).json({ success: false, error: '卡号和密码不能为空' })
    }
    // 校验卡号和密码
    db.query('SELECT * FROM card WHERE cardnumber = ? AND password = ?', [cardnumber, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        if (results.length === 0) return res.status(401).json({ success: false, error: '卡号或密码错误' })
        // 查找未下机的上机记录
        db.query('SELECT * FROM login_log WHERE cardnumber = ? AND logout_time IS NULL ORDER BY login_time DESC LIMIT 1', [cardnumber], (err2, logs) => {
            if (err2) return res.status(500).json({ success: false, error: '查询上机记录失败' })
            if (logs.length === 0) return res.status(400).json({ success: false, error: '没有未下机的上机记录' })
            const log = logs[0]
            const loginTime = new Date(log.login_time)
            const now = new Date()
            // 计算用时（分钟，向上取整）
            const duration = Math.ceil((now - loginTime) / 60000)
            const fee = duration * 1 // 每分钟1元
            // 查询余额
            const balance = results[0].balance
            if (balance < fee) return res.status(400).json({ success: false, error: '余额不足' })
            // 扣除余额
            db.query('UPDATE card SET balance = balance - ? WHERE cardnumber = ?', [fee, cardnumber], (err3) => {
                if (err3) return res.status(500).json({ success: false, error: '扣费失败' })
                // 更新下机记录
                db.query('UPDATE login_log SET logout_time = ?, duration = ?, fee = ? WHERE id = ?', [now, duration, fee, log.id], (err4) => {
                    if (err4) return res.status(500).json({ success: false, error: '更新下机记录失败' })
                    res.json({ success: true, duration, fee, left: balance - fee, logout_time: now })
                })
            })
        })
    })
})

module.exports = router 