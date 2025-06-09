// 引入 express 框架
const express = require('express')
const router = express.Router()
const db = require('../db')
// 注销卡接口
// 路径：POST /card/delete
// 参数：cardnumber, password
router.post('/delete', (req, res) => {
    const { cardnumber, password } = req.body
    if (!cardnumber || !password) {
        return res.status(400).json({ success: false, error: '卡号和密码不能为空' })
    }
    db.query('SELECT * FROM card WHERE cardnumber = ? AND password = ?', [cardnumber, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        if (results.length === 0) return res.status(401).json({ success: false, error: '卡号或密码错误' })
        // 先删除 login_log 表中的相关记录
        db.query('DELETE FROM login_log WHERE cardnumber = ?', [cardnumber], (err1) => {
            if (err1) return res.status(500).json({ success: false, error: '注销失败（删除日志）' })
            // 再删除 card 表中的卡片
            db.query('DELETE FROM card WHERE cardnumber = ?', [cardnumber], (err2) => {
                if (err2) return res.status(500).json({ success: false, error: '注销失败' })
                res.json({ success: true, message: '注销成功' })
            })
        })
    })
})
module.exports = router 