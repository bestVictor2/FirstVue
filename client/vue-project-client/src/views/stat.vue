<template>
  <div class="stat-flex-container">
    <aside class="stat-sidebar">
      <h2>统计菜单</h2>
      <select v-model="selected" @change="reset" class="stat-select">
        <option value="1">消费明细（所有卡号）</option>
        <option value="2">消费明细（按天）</option>
        <option value="3">充值明细（所有卡号）</option>
        <option value="4">退款明细（所有卡号）</option>
        <option value="5">充值明细（按天）</option>
        <option value="6">退款明细（按天）</option>
      </select>
      <div v-if="needDate" class="form-group">
        <label>选择日期：</label>
        <input type="date" v-model="date" class="stat-date" />
      </div>
      <button @click="fetchStat" class="stat-btn">查询</button>
      <div v-if="message" class="stat-error">{{ message }}</div>
    </aside>
    <main class="stat-main">
      <div v-if="records && Object.keys(records).length" class="group-list">
        <div v-for="(recs, cardnumber) in records" :key="cardnumber" class="card-group">
          <div class="card-header">
            <h4>卡号: {{ cardnumber }}</h4>
          </div>
          <table v-if="isConsume" class="stat-table">
            <thead>
              <tr>
                <th>上机时间</th>
                <th>下机时间</th>
                <th>消费金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in recs" :key="rec.start + rec.end">
                <td>{{ formatTime(rec.start) }}</td>
                <td>{{ formatTime(rec.end) }}</td>
                <td>{{ rec.fee }} 元</td>
              </tr>
              <tr class="stat-total-row">
                <td colspan="2"><b>总消费</b></td>
                <td><b>{{ totalFee[cardnumber] }} 元</b></td>
              </tr>
            </tbody>
          </table>
          <table v-else class="stat-table">
            <thead>
              <tr>
                <th>{{ isRefund ? '退款时间' : '充值时间' }}</th>
                <th>金额</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rec in recs" :key="rec.time + rec.amount">
                <td>{{ formatTime(rec.time) }}</td>
                <td>{{ rec.amount }} 元</td>
              </tr>
              <tr class="stat-total-row">
                <td><b>总{{ isRefund ? '退款' : '充值' }}</b></td>
                <td><b>{{ isRefund ? totalRefund[cardnumber] : totalRecharge[cardnumber] }} 元</b></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="dayTotal !== undefined" class="stat-day-total">
        <b>{{ date }} 总{{ isConsume ? '消费' : (isRefund ? '退款' : '充值') }}: {{ dayTotal }} 元</b>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const selected = ref('1')
const date = ref('')
const records = ref(null)
const totalFee = ref({})
const totalRecharge = ref({})
const totalRefund = ref({})
const dayTotal = ref(undefined)
const message = ref('')

const needDate = computed(() => ['2', '5', '6'].includes(selected.value))
const isConsume = computed(() => ['1', '2'].includes(selected.value))
const isRefund = computed(() => ['4', '6'].includes(selected.value))

function formatTime(val) {
  // 兼容字符串和Date对象，输出标准可读格式
  if (!val) return ''
  const d = dayjs(val)
  if (!d.isValid()) return val
  return d.format('YYYY-MM-DD HH:mm:ss')
}

function reset() {
  records.value = null
  totalFee.value = {}
  totalRecharge.value = {}
  totalRefund.value = {}
  dayTotal.value = undefined
  message.value = ''
  date.value = ''
}

async function fetchStat() {
  records.value = null
  totalFee.value = {}
  totalRecharge.value = {}
  totalRefund.value = {}
  dayTotal.value = undefined
  message.value = ''
  let url = ''
  let params = {}
  switch (selected.value) {
    case '1':
      url = '/stat/consume/detail'
      break
    case '2':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/consume/detail/day'
      params = { date: date.value }
      break
    case '3':
      url = '/stat/recharge/detail'
      break
    case '4':
      url = '/stat/refund/detail'
      break
    case '5':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/recharge/detail/day'
      params = { date: date.value }
      break
    case '6':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/refund/detail/day'
      params = { date: date.value }
      break
  }
  try {
    const res = await axios.get('http://localhost:3000' + url, { params })
    if (res.data && res.data.success) {
      records.value = res.data.records
      totalFee.value = res.data.totalFee || {}
      totalRecharge.value = res.data.totalRecharge || {}
      totalRefund.value = res.data.totalRefund || {}
      dayTotal.value = res.data.dayTotal
    } else {
      message.value = res.data.error || '查询失败'
    }
  } catch (err) {
    message.value = '查询失败：' + (err.response?.data?.error || err.message)
  }
}
</script>

<style scoped>
.stat-flex-container {
  display: flex;
  min-height: 100%;
  background: linear-gradient(120deg, #e0eafc 0%, #f0f4f8 100%);
}
.stat-sidebar {
  width: 270px;
  background: linear-gradient(135deg, #f8fffa 60%, #e0eafc 100%);
  box-shadow: 2px 0 24px rgba(60, 120, 200, 0.10);
  border-radius: 0 24px 24px 0;
  padding: 3rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2.2rem;
}
.stat-sidebar h2 {
  color: #42b983;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
/* .stat-sidebar h2::before {
  content: '\1F4CA'; 
  font-size: 2.1rem;
} */
.stat-select, .stat-date {
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1.5px solid #d0d7de;
  border-radius: 8px;
  font-size: 1.08rem;
  margin-bottom: 1.2rem;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  background: #f8fafc;
}
.stat-select:focus, .stat-date:focus {
  border-color: #42b983;
  background: #f6fffa;
  box-shadow: 0 0 0 2px #e0eafc;
}
.stat-btn {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #42b983 0%, #3a8ee6 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.15rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 1.2rem;
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  box-shadow: 0 2px 12px rgba(60, 120, 200, 0.10);
}
.stat-btn:hover {
  background: linear-gradient(90deg, #3a8ee6 0%, #42b983 100%);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 4px 18px rgba(60, 120, 200, 0.13);
}
.stat-error {
  margin-top: 0.5rem;
  font-size: 1rem;
  color: #e74c3c;
  text-align: left;
}
.stat-main {
  flex: 1;
  padding: 3rem 2.5rem 2.5rem 2.5rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: transparent;
}
.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  width: 100%;
  align-items: stretch;
}
.card-group {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 120, 200, 0.13);
  padding: 1.5rem 1.2rem 1.2rem 1.2rem;
  border-left: 6px solid #42b983;
  display: flex;
  flex-direction: column;
  min-width: 0;
  transition: box-shadow 0.2s, transform 0.15s;
}
.card-group:hover {
  box-shadow: 0 8px 32px rgba(60, 120, 200, 0.18);
  transform: translateY(-3px) scale(1.02);
}
.card-header {
  margin-bottom: 0.7rem;
  border-bottom: 1.5px solid #e0eafc;
  padding-bottom: 0.5rem;
}
.card-header h4 {
  color: #42b983;
  font-size: 1.18rem;
  font-weight: bold;
  margin: 0;
}
.stat-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(60, 120, 200, 0.04);
}
.stat-table th, .stat-table td {
  border: 1px solid #e0eafc;
  padding: 0.6rem 0.8rem;
  text-align: center;
  font-size: 1.05rem;
}
.stat-table th {
  background: #f0f4f8;
  color: #3a8ee6;
  font-weight: bold;
}
.stat-table tr:nth-child(even) {
  background: #f6fffa;
}
.stat-table tr:hover {
  background: #e0eafc;
}
.stat-total-row {
  background: #e6f9f0 !important;
  font-weight: bold;
}
.stat-day-total {
  margin-top: 1.5rem;
  font-size: 1.15rem;
  color: #3a8ee6;
  text-align: right;
  width: 100%;
}
@media (max-width: 900px) {
  .stat-flex-container {
    flex-direction: column;
  }
  .stat-sidebar {
    width: 100%;
    border-radius: 0 0 24px 24px;
    box-shadow: 0 2px 16px rgba(60, 120, 200, 0.08);
    align-items: center;
    padding: 1.2rem 0.5rem;
    gap: 1.2rem;
  }
  .stat-main {
    padding: 1rem 0.5rem;
  }
  .group-list {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
}
</style> 