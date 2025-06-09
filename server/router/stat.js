const express = require('express')
const router = express.Router()
const db = require('../db')

// 1. 统计每个卡号总消费
router.get('/consume/total', (req, res) => {
    db.query('SELECT cardnumber, SUM(fee) as total_fee FROM login_log GROUP BY cardnumber', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results })
    })
})
// 2. 统计某一天总消费
router.get('/consume/day', (req, res) => {
    const { date } = req.query
    db.query('SELECT SUM(fee) as total_fee FROM login_log WHERE DATE(login_time) = ?', [date], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results[0] })
    })
})
// 3. 统计每个卡号充值金额
router.get('/recharge/total', (req, res) => {
    db.query('SELECT cardnumber, SUM(amount) as total_recharge FROM recharge_log GROUP BY cardnumber', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results })
    })
})
// 4. 统计每个卡号退款金额
router.get('/refund/total', (req, res) => {
    db.query('SELECT cardnumber, SUM(amount) as total_refund FROM refund_log GROUP BY cardnumber', (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results })
    })
})
// 5. 统计某一天充值金额
router.get('/recharge/day', (req, res) => {
    const { date } = req.query
    db.query('SELECT SUM(amount) as total_recharge FROM recharge_log WHERE DATE(time) = ?', [date], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results[0] })
    })
})
// 6. 统计某一天退款金额
router.get('/refund/day', (req, res) => {
    const { date } = req.query
    db.query('SELECT SUM(amount) as total_refund FROM refund_log WHERE DATE(time) = ?', [date], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: '数据库错误' })
        res.json({ success: true, data: results[0] })
    })
})

module.exports = router 