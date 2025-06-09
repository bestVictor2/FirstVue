// 引入 express 框架
const express = require('express')
const router = express.Router()
const db = require('../db')

// 充值接口
// 路径：POST /card/recharge
// 参数：cardnumber, amount
router.post('/recharge', (req, res) => {
    const { cardnumber, amount } = req.body
    if (!cardnumber || !amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ success: false, error: '卡号和金额必须填写且金额大于0' })
    }
    db.query('SELECT * FROM card WHERE cardnumber = ?', [cardnumber], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        if (results.length === 0) return res.status(404).json({ success: false, error: '卡号不存在' })
        db.query('UPDATE card SET balance = balance + ? WHERE cardnumber = ?', [amount, cardnumber], (err2) => {
            if (err2) return res.status(500).json({ success: false, error: '充值失败' })
            db.query('INSERT INTO recharge_log (cardnumber, amount) VALUES (?, ?)', [cardnumber, amount], (err3) => {
                if (err3) return res.status(500).json({ success: false, error: '充值日志写入失败' })
                res.json({ success: true, message: '充值成功' })
            })
        })
    })
})

module.exports = router 