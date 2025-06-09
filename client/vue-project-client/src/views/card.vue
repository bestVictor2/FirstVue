<template>
  <!-- 卡片添加表单主容器 -->
  <div class="card-container">
    <div class="card-form">
      <h2>添加卡</h2>
      <!-- 表单，提交时调用 submitform 方法 -->
      <form @submit.prevent="submitform">
        <div class="form-group">
          <label>卡号</label>
          <!-- 绑定卡号输入框到 form.cardnumber -->
          <input type="text" v-model="form.cardnumber" required placeholder="请输入卡号" />
        </div>
        <div class="form-group">
          <label>姓名</label>
          <!-- 绑定姓名输入框到 form.username -->
          <input type="text" v-model="form.username" required placeholder="请输入姓名" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <!-- 绑定密码输入框到 form.password -->
          <input type="password" v-model="form.password" required placeholder="请输入密码" />
        </div>
        <!-- 提交按钮 -->
        <button type="submit" class="submit-btn">提交</button>
      </form>
      <!-- 消息提示，带淡入淡出动画 -->
      <transition name="fade">
        <div v-if="message" :style="{color: messageColor}" class="message">{{ message }}</div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// 表单数据，包含卡号、姓名、密码
const form = ref({ cardnumber:'', username: '', password: '' })
// 消息内容和颜色，用于反馈提交结果
const message = ref('')
const messageColor = ref('green')

// 表单提交方法，向后端发送添加卡请求
async function submitform() {
  try {
    // 发送 POST 请求到后端接口
    const res = await axios.post('http://localhost:3000/card/addcard', form.value)
    if (res.data && res.data.success) {
      // 添加成功，显示成功消息并重置表单
      message.value = '添加成功！ID: ' + res.data.id
      messageColor.value = 'green'
      form.value = { cardnumber:'', username: '', password: '' }
    } else {
      // 添加失败，显示错误消息
      message.value = '添加失败：' + (res.data.error || '未知错误')
      messageColor.value = 'red'
    }
  } catch (err) {
    // 网络或服务器错误
    message.value = '请求失败：' + (err.response?.data?.error || err.message)
    messageColor.value = 'red'
  }
}
</script>

<style scoped>
/* 页面主容器，居中显示，渐变背景 */
.card-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
/* 表单卡片样式，圆角、阴影、居中 */
.card-form {
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
/* 标题样式 */
h2 {
  color: #42b983;
  margin-bottom: 1.5rem;
}
/* 表单分组样式 */
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
/* 输入框样式 */
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
/* 提交按钮样式 */
.submit-btn {
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
.submit-btn:hover {
  background: linear-gradient(90deg, #3a8ee6 0%, #42b983 100%);
}
/* 消息提示样式 */
.message {
  margin-top: 1.2rem;
  font-size: 1rem;
  text-align: center;
}
/* 淡入淡出动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
  