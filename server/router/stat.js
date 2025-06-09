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
// 详细消费明细（所有卡号）
router.get('/consume/detail', (req, res) => {
    db.query(
        `SELECT cardnumber, login_time, logout_time, fee FROM login_log ORDER BY cardnumber, login_time`,
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalFee = {};
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalFee[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    start: row.login_time,
                    end: row.logout_time,
                    fee: row.fee
                });
                totalFee[row.cardnumber] += Number(row.fee);
            });
            res.json({ success: true, records, totalFee });
        }
    );
});
// 详细消费明细（按天）
router.get('/consume/detail/day', (req, res) => {
    const { date } = req.query;
    db.query(
        `SELECT cardnumber, login_time, logout_time, fee FROM login_log WHERE DATE(login_time) = ? ORDER BY cardnumber, login_time`,
        [date],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalFee = {};
            let dayTotal = 0;
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalFee[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    start: row.login_time,
                    end: row.logout_time,
                    fee: row.fee
                });
                totalFee[row.cardnumber] += Number(row.fee);
                dayTotal += Number(row.fee);
            });
            res.json({ success: true, records, totalFee, dayTotal, date });
        }
    );
});
// 详细充值明细（所有卡号）
router.get('/recharge/detail', (req, res) => {
    db.query(
        `SELECT cardnumber, amount, time FROM recharge_log ORDER BY cardnumber, time`,
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalRecharge = {};
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalRecharge[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    time: row.time,
                    amount: row.amount
                });
                totalRecharge[row.cardnumber] += Number(row.amount);
            });
            res.json({ success: true, records, totalRecharge });
        }
    );
});
// 详细充值明细（按天）
router.get('/recharge/detail/day', (req, res) => {
    const { date } = req.query;
    db.query(
        `SELECT cardnumber, amount, time FROM recharge_log WHERE DATE(time) = ? ORDER BY cardnumber, time`,
        [date],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalRecharge = {};
            let dayTotal = 0;
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalRecharge[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    time: row.time,
                    amount: row.amount
                });
                totalRecharge[row.cardnumber] += Number(row.amount);
                dayTotal += Number(row.amount);
            });
            res.json({ success: true, records, totalRecharge, dayTotal, date });
        }
    );
});
// 详细退款明细（所有卡号）
router.get('/refund/detail', (req, res) => {
    db.query(
        `SELECT cardnumber, amount, time FROM refund_log ORDER BY cardnumber, time`,
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalRefund = {};
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalRefund[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    time: row.time,
                    amount: row.amount
                });
                totalRefund[row.cardnumber] += Number(row.amount);
            });
            res.json({ success: true, records, totalRefund });
        }
    );
});
// 详细退款明细（按天）
router.get('/refund/detail/day', (req, res) => {
    const { date } = req.query;
    db.query(
        `SELECT cardnumber, amount, time FROM refund_log WHERE DATE(time) = ? ORDER BY cardnumber, time`,
        [date],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, error: '数据库错误' });
            const records = {};
            const totalRefund = {};
            let dayTotal = 0;
            results.forEach(row => {
                if (!records[row.cardnumber]) {
                    records[row.cardnumber] = [];
                    totalRefund[row.cardnumber] = 0;
                }
                records[row.cardnumber].push({
                    time: row.time,
                    amount: row.amount
                });
                totalRefund[row.cardnumber] += Number(row.amount);
                dayTotal += Number(row.amount);
            });
            res.json({ success: true, records, totalRefund, dayTotal, date });
        }
    );
});

module.exports = router 