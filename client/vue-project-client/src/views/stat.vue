<template>
  <div class="stat-container">
    <div class="stat-card">
      <h2>统计菜单</h2>
      <select v-model="selected" @change="reset">
        <option value="1">统计每个卡号总消费</option>
        <option value="2">统计某一天总消费</option>
        <option value="3">统计每个卡号充值金额</option>
        <option value="4">统计每个卡号退款金额</option>
        <option value="5">统计某一天充值金额</option>
        <option value="6">统计某一天退款金额</option>
      </select>
      <div v-if="needDate" class="form-group">
        <label>选择日期：</label>
        <input type="date" v-model="date" />
      </div>
      <button @click="fetchStat">查询</button>
      <div v-if="result">
        <h3>统计结果</h3>
        <table v-if="Array.isArray(result)">
          <thead>
            <tr>
              <th v-for="(v, k) in result[0]" :key="k">{{ k }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in result" :key="idx">
              <td v-for="(v, k) in row" :key="k">{{ v }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <span v-for="(v, k) in result" :key="k">{{ k }}：{{ v }}</span>
        </div>
      </div>
      <div v-if="message" style="color:red">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'

const selected = ref('1')
const date = ref('')
const result = ref(null)
const message = ref('')

const needDate = computed(() => ['2', '5', '6'].includes(selected.value))

function reset() {
  result.value = null
  message.value = ''
  date.value = ''
}

async function fetchStat() {
  result.value = null
  message.value = ''
  let url = ''
  let params = {}
  switch (selected.value) {
    case '1':
      url = '/stat/consume/total'
      break
    case '2':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/consume/day'
      params = { date: date.value }
      break
    case '3':
      url = '/stat/recharge/total'
      break
    case '4':
      url = '/stat/refund/total'
      break
    case '5':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/recharge/day'
      params = { date: date.value }
      break
    case '6':
      if (!date.value) return message.value = '请选择日期'
      url = '/stat/refund/day'
      params = { date: date.value }
      break
  }
  try {
    const res = await axios.get('http://localhost:3000' + url, { params })
    if (res.data && res.data.success) {
      result.value = res.data.data
    } else {
      message.value = res.data.error || '查询失败'
    }
  } catch (err) {
    //console.log(err)
    message.value = '查询失败：' + (err.response?.data?.error || err.message)
  }
}
</script>

<style scoped>
.stat-container {
  min-height: 100%;
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
  max-width: 400px;
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
pre {
  background: #f6fffa;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  overflow-x: auto;
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
</style> 