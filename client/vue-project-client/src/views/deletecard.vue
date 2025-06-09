<!-- src/components/Card.vue -->
<template>
  <div class="delete-container">
    <div class="delete-card">
      <h2>注销卡</h2>
      <form @submit.prevent="deleteCard">
        <div class="form-group">
          <label>卡号</label>
          <input type="text" v-model="cardnumber" required placeholder="请输入卡号" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="password" required placeholder="请输入密码" />
        </div>
        <button type="submit">注销</button>
      </form>
      <div v-if="message" :style="{color: messageColor}">{{ message }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const cardnumber = ref('')
const password = ref('')
const message = ref('')
const messageColor = ref('green')

async function deleteCard() {
  message.value = ''
  try {
    const res = await axios.post('http://localhost:3000/card/delete', {
      cardnumber: cardnumber.value,
      password: password.value
    })
    if (res.data && res.data.success) {
      message.value = '注销成功！'
      messageColor.value = 'green'
    } else {
      message.value = res.data.error || '注销失败'
      //console.log(111)
      messageColor.value = 'red'
    }
  } catch (err) {
    message.value = '注销失败：' + (err.response?.data?.error || err.message)
    //console.log(222)
    //console.log(err)
    messageColor.value = 'red'
  }
}
</script>

<style scoped>
.delete-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
.delete-card {
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
</style>
  