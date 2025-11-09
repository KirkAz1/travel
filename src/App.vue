<template>
  <!-- =======================导航栏======================= -->
  <el-row :gutter="20" class="navbar">
    <!-- Logo 区域 -->
    <el-col :span="6" class="logo-col">
      <div class="logo-wrapper">
        <img src="/vector/Logo.png" alt="Logo" class="login-icon" />
        <h1 class="logo">Travelo</h1>
      </div>
    </el-col>

    <!-- 搜索区域 -->
    <el-col :span="6" class="search-col">
      <div class="search-container">
        <el-input 
          v-model="searchQuery" 
          placeholder="搜索目的地、旅游线路..." 
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <div class="search-icon-wrapper" @click="handleSearch">
          <img src="/vector/Search.png" alt="搜索" class="search-icon" />
        </div>
      </div>
    </el-col>

    <!-- 导航栏 -->
    <el-col :span="6" class="nav-col">
      <div class="nav-links">
        <span class="nav-title" @click="goTo('/')">首页</span>
        <span class="nav-title" @click="goTo('/contact')">联系</span>
        <span class="nav-title" @click="goTo('/holiday')">假期套餐</span>
        <span class="nav-title" @click="goTo('/testimonial')">客户评价</span>
      </div>
    </el-col>

    <!-- 登录按钮 -->
    <el-col :span="6" class="login-col">
      <div class="login-btn" @click="goTo('/login')">登录</div>
    </el-col>
  </el-row>

  <!-- =========================路由内容========================= -->
  <router-view />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')

// 搜索跳转
const handleSearch = () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  router.push({ path: '/search', query: { q: searchQuery.value } })
}

// 导航跳转
const goTo = (path) => {
  router.push(path)
}
</script>

<style>
.navbar {
  width: 100%; 
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eaeaea;
}

.logo-col { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}

.logo-wrapper {
  display: flex; 
  align-items: center; 
  gap: 8px; 
}

.login-icon { 
  width: 40px; 
  height: 40px; 
  object-fit: contain;
}

.logo { 
  margin: 0; 
  font-size: 28px; 
  font-weight: bold; 
  line-height: 1; 
}

.search-container { 
  display: flex; 
  align-items: center;
}

.search-input input { 
  border-radius: 0 !important; 
  border-right: none !important;
}

.search-icon-wrapper { 
  height: 45px;
  width: 50px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  border-radius: 0 !important; 
  border-left: none !important; 
  cursor: pointer; 
  transition: background-color 0.3s;
}

.search-icon-wrapper:hover { 
  background-color: #C4F1BE; 
}

.search-icon { 
  width: 20px; 
  height: 20px; 
}

.nav-col {
  display: flex;
  justify-content: center; 
}

.nav-links {
  display: flex; 
  gap: 30px; 
}

.nav-title {
  cursor: pointer; 
  font-weight: 500; 
  transition: color 0.3s; 
  padding: 5px 10px; 
  border-radius: 4px;
}

.nav-title:hover { 
  color: #C4F1BE; 
}

.login-col { 
  display: flex; 
  justify-content: flex-end;
}

.login-btn { 
  width: 86px; 
  padding: 8px 20px; 
  background-color: #C4F1BE; 
  color: #000; 
  border-radius: 4px; 
  cursor: pointer; 
  transition: background-color 0.3s; 
  text-align: center; 
}
</style>
