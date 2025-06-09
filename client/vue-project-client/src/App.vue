<script setup>
// 菜单项配置，每个菜单对应一个页面功能
const menuItems = [
  { id: 1, label: '添加卡' },
  { id: 2, label: '查询卡' },
  { id: 3, label: '上机' },
  { id: 4, label: '下机' },
  { id: 5, label: '充值' },
  { id: 6, label: '退费' },
  { id: 7, label: '统计' },
  { id: 8, label: '注销卡' },
]
// 根据菜单项 id 返回对应的路由路径
function getRoutePath(item) {
  switch(item.id) {
    case 1: return '/card';
    case 2: return '/querycard';
    case 3: return '/login';
    case 4: return '/logout';
    case 5: return '/recharge';
    case 6: return '/refund';
    case 7: return '/stat';
    case 8: return '/deletecard';
    default: return '/';
  }
}
// 引入 vue-router 相关 API
import { RouterLink,RouterView, useRoute } from 'vue-router';
const route = useRoute();
</script>

<template>
  <!-- 主容器，包含菜单栏和内容区 -->
  <div class="container">
    <!-- 侧边菜单栏 -->
    <aside class="menu">
      <h2>菜单</h2>
      <ul>
        <!-- 遍历菜单项，生成导航链接 -->
        <li v-for="item in menuItems" :key="item.id">
          <router-link
            :to="getRoutePath(item)"
            class="menu-link"
            :class="{ active: route.path === getRoutePath(item) }"
          >
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </aside>
    <!-- 内容区，显示当前路由页面 -->
    <main class="work">
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>

.container {
  position: relative;
  z-index: 1;
  display: flex;
  height: 100vh;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #f0f4f8 0%, #e0eafc 100%);
}
/* 菜单栏样式，卡片风格，阴影、圆角 */
.menu {
  width: 300px;
  background: #fff;
  box-shadow: 2px 0 16px rgba(60, 120, 200, 0.08);
  border-radius: 0 16px 16px 0;
  padding: 2rem 1.2rem 1.2rem 1.2rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.menu h2 {
  color: #42b983;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  letter-spacing: 2px;
}
.menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}
.menu li {
  margin-bottom: 1.1rem;
}
/* 菜单链接样式，悬停和激活高亮 */
.menu-link {
  display: block;
  width: 70%;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  color: #333;
  text-decoration: none;
  font-size: 1.08rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}
.menu-link:hover {
  background: #e6f9f0;
  color: #42b983;
}
.menu-link.active {
  background: linear-gradient(90deg, #42b983 0%, #3a8ee6 100%);
  color: #fff;
  font-weight: bold;
}
/* 内容区样式 */
.work {
  flex: 1;
  padding: 2.5rem 2rem;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: transparent;
}
/* 响应式布局，窄屏下菜单栏在上方 */
@media (max-width: 700px) {
  .container {
    flex-direction: column;
  }
  .menu {
    width: 100%;
    border-radius: 0 0 16px 16px;
    box-shadow: 0 2px 16px rgba(60, 120, 200, 0.08);
    align-items: center;
    padding: 1.2rem 0.5rem;
  }
  .work {
    padding: 1rem 0.5rem;
  }
}
</style>
