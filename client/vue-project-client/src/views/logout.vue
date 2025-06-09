<!-- src/components/Card.vue -->
<template>
  <div class="logout-container">
    <div class="logout-card">
      <h2>下机</h2>
      <!-- 下机表单 -->
      <form @submit.prevent="logout">
        <div class="form-group">
          <label>卡号</label>
          <input type="text" v-model="cardnumber" required placeholder="请输入卡号" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="password" required placeholder="请输入密码" />
        </div>
        <button type="submit">下机</button>
      </form>
      <div v-if="result" class="success-msg">
        下机成功！<br>
        用时：{{ result.duration }} 分钟<br>
        消费金额：{{ result.fee }} 元<br>
        剩余余额：{{ result.left }} 元<br>
        下机时间：{{ formatTime(result.logout_time) }}
      </div>
      <div v-if="message" :style="{color: 'red'}">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'

const cardnumber = ref('')
const password = ref('')
const result = ref(null)
const message = ref('')

function formatTime(isoString) {
  return dayjs(isoString).format('YYYY-MM-DD HH:mm:ss')
}

async function logout() {
  result.value = null
  message.value = ''
  try {
    const res = await axios.post('http://localhost:3000/card/logout', {
      cardnumber: cardnumber.value,
      password: password.value
    })
    if (res.data && res.data.success) {
      result.value = res.data
    } else {
      message.value = res.data.error || '下机失败'
    }
  } catch (err) {
    message.value = '下机失败：' + (err.response?.data?.error || err.message)
  }
}
</script>

<style scoped>
.logout-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
.logout-card {
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
input[type="text"],
input[type="password"] {
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
.success-msg {
  margin-top: 1.2rem;
  color: #42b983;
  font-size: 1.05rem;
}
</style>
  