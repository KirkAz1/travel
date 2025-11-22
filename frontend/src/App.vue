<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 顶部导航栏 - 登录/注册页面隐藏 -->
      <el-header v-if="!isAuthPage" class="app-header">
        <nav-bar />
      </el-header>
      
      <!-- 主要内容区域 -->
      <el-main :class="['app-main', { 'auth-page-main': isAuthPage }]">
        <router-view />
      </el-main>
      
      <!-- 底部信息 - 登录/注册页面隐藏 -->
      <el-footer v-if="!isAuthPage" class="app-footer">
        <div class="footer-content">
          <p>&copy; 2024 游迹全国 - 专业在线旅游预订平台</p>
        </div>
      </el-footer>
    </el-container>
    
    <!-- 自定义消息提示 -->
    <custom-message ref="customMessageRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import CustomMessage from '@/components/CustomMessage.vue'

const customMessageRef = ref()
const route = useRoute()

// 判断当前是否为认证页面（登录/注册）
const isAuthPage = computed(() => {
  return route.name === 'login' || route.name === 'register'
})

// 提供全局消息方法
const showMessage = {
  success: (content, duration) => customMessageRef.value?.success(content, duration),
  error: (content, duration) => customMessageRef.value?.error(content, duration),
  warning: (content, duration) => customMessageRef.value?.warning(content, duration),
  info: (content, duration) => customMessageRef.value?.info(content, duration)
}

provide('message', showMessage)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  padding: 0;
  height: auto;
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.app-main {
  padding: 0;
  min-height: calc(100vh - 160px);
}

/* 认证页面的主内容区域样式 */
.app-main.auth-page-main {
  min-height: 100vh;
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.app-footer {
  background: linear-gradient(135deg, #74ebd5 0%, #9face6 100%);
  color: #ecf0f1;
  text-align: center;
  padding: 20px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  line-height: 0px;
}
</style>