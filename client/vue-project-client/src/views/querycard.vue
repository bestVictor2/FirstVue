<!-- src/components/Card.vue -->
<template>
  <div class="query-container">
    <div class="query-card">
      <h2>查询卡片</h2>
      <!-- 查询表单 -->
      <form @submit.prevent="queryCard">
        <div class="form-group">
          <label>卡号</label>
          <input type="text" v-model="cardnumber" required placeholder="请输入卡号" />
        </div>
        <button type="submit">查询</button>
      </form>
      <!-- 查询结果展示 -->
      <div v-if="card" class="result-box">
        <h3>卡片信息</h3>
        <ul>
          <li><strong>卡号：</strong>{{ card.cardnumber }}</li>
          <li><strong>姓名：</strong>{{ card.username }}</li>
          <li><strong>金额：</strong>{{ card.balance }}</li>
          <li><strong>创建时间：</strong>{{ formatTime(card.created_at) }}</li>
        </ul>
      </div>
      <div v-if="message" :style="{color: 'red'}" class="msg">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

// 查询输入的卡号
const cardnumber = ref('')
// 查询到的卡片信息
const card = ref(null)
// 错误或提示信息
const message = ref('')

// 格式化时间为本地可读格式
function formatTime(isoString) {
  return dayjs(isoString).format('YYYY-MM-DD HH:mm:ss')
}

// 查询卡片方法
async function queryCard() {
  card.value = null
  message.value = ''
  try {
    const res = await axios.get('http://localhost:3000/card/query', { params: { cardnumber: cardnumber.value } })
    if (res.data && res.data.success && res.data.card) {
      card.value = res.data.card
    } else {
      message.value = res.data.error || '未找到该卡片'
    }
  } catch (err) {
    message.value = '查询失败：' + (err.response?.data?.error || err.message)
  }
}
</script>

<style scoped>
.query-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
.query-card {
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
  width: 100%;
  margin-bottom: 1.1rem;
  display: flex;
  flex-direction: column;
}
label {
  font-size: 1rem;
  margin-bottom: 0.3rem;
  color: #333;
}
input[type="text"] {
  padding: 0.6rem 0.8rem;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  font-size: 1rem;
  transition: border 0.2s;
  outline: none;
}
input:focus {
  border-color: #42b983;
  background: #f6fffa;
}
button {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(90deg, #42b983 0%, #3a8ee6 100%);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(60, 120, 200, 0.08);
}
button:hover {
  background: linear-gradient(90deg, #3a8ee6 0%, #42b983 100%);
}
.result-box {
  width: 100%;
  background: #f6fffa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(60, 120, 200, 0.06);
  padding: 1.2rem 1rem 1rem 1rem;
  margin-top: 1.2rem;
}
.result-box h3 {
  color: #3a8ee6;
  margin-bottom: 0.8rem;
  font-size: 1.1rem;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
li {
  margin-bottom: 0.5rem;
  font-size: 1.05rem;
  border-bottom: 1px solid #e0eafc;
  padding-bottom: 0.3rem;
}
li:last-child {
  border-bottom: none;
}
.msg {
  margin-top: 1.2rem;
  font-size: 1rem;
  text-align: center;
}
</style>
  