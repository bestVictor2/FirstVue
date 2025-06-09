<template>
  <div class="stat-container">
    <div class="stat-card">
      <h2>统计菜单</h2>
      <select v-model="selected" @change="reset">
        <option value="1">消费明细（所有卡号）</option>
        <option value="2">消费明细（按天）</option>
        <option value="3">充值明细（所有卡号）</option>
        <option value="4">退款明细（所有卡号）</option>
        <option value="5">充值明细（按天）</option>
        <option value="6">退款明细（按天）</option>
      </select>
      <div v-if="needDate" class="form-group">
        <label>选择日期：</label>
        <input type="date" v-model="date" />
      </div>
      <button @click="fetchStat">查询</button>
      <div v-if="records && Object.keys(records).length">
        <div v-for="(recs, cardnumber) in records" :key="cardnumber" class="card-group">
          <h4>卡号: {{ cardnumber }}</h4>
          <table v-if="isConsume">
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
              <tr>
                <td colspan="2"><b>总消费</b></td>
                <td><b>{{ totalFee[cardnumber] }} 元</b></td>
              </tr>
            </tbody>
          </table>
          <table v-else>
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
              <tr>
                <td><b>总{{ isRefund ? '退款' : '充值' }}</b></td>
                <td><b>{{ isRefund ? totalRefund[cardnumber] : totalRecharge[cardnumber] }} 元</b></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="dayTotal !== undefined">
          <b>{{ date }} 总{{ isConsume ? '消费' : (isRefund ? '退款' : '充值') }}: {{ dayTotal }} 元</b>
        </div>
      </div>
      <div v-if="message" style="color:red">{{ message }}</div>
    </div>
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
.stat-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
.stat-card {
  background: #fff;
  padding: 2.5rem 2rem 2rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(60, 120, 200, 0.12);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
}
.form-group {
  margin: 1rem 0;
}
button {
  margin-top: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #e0eafc;
  padding: 0.5rem 0.7rem;
  text-align: center;
}
th {
  background: #f0f4f8;
  color: #3a8ee6;
}
.card-group {
  margin-bottom: 2.2rem;
}
</style> 