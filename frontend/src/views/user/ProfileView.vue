<template>
  <div class="profile-container">
    <div class="profile-sidebar">
      <div class="profile-header">
        <div class="avatar">
          <el-avatar :size="80" :src="user?.avatar || defaultAvatar">
            {{ user?.username?.charAt(0) || '用' }}
          </el-avatar>
        </div>
        <h3>{{ user?.username || '游客' }}</h3>
        <p class="user-email">{{ user?.email || '未设置邮箱' }}</p>
      </div>
      <div class="menu-list">
        <el-menu :default-active="activeMenu" class="sidebar-menu" router>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/favorites">
            <el-icon><Star /></el-icon>
            <span>我的收藏</span>
          </el-menu-item>
          <el-menu-item index="/profile/change-password">
            <el-icon><Lock /></el-icon>
            <span>修改密码</span>
          </el-menu-item>
        </el-menu>
      </div>
    </div>
    <div class="profile-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { User, Star, Lock } from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';

const user = computed(() => authStore.state.user);

const activeMenu = computed(() => {
  const path = route.path;
  if (path.startsWith('/profile/change-password')) {
    return '/profile/change-password';
  } else if (path === '/favorites') {
    return '/favorites';
  }
  return '/profile';
});
</script>

<style scoped>
.profile-container {
  display: flex;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
}

.profile-sidebar {
  width: 260px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  height: calc(100vh - 60px);
  position: sticky;
  top: 60px;
}

.profile-header {
  padding: 30px 20px;
  text-align: center;
  border-bottom: 1px solid #ebeef5;
}

.avatar {
  margin-bottom: 16px;
}

.profile-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #303133;
}

.user-email {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.menu-list {
  padding: 10px 0;
}

.sidebar-menu {
  border-right: none;
  width: 100%;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  color: #409eff;
  background-color: #ecf5ff;
}

.profile-main {
  flex: 1;
  padding: 20px;
  min-width: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
    height: auto;
    position: static;
  }
  
  .menu-list {
    padding: 0;
  }
  
  .sidebar-menu {
    display: flex;
    overflow-x: auto;
  }
  
  .sidebar-menu :deep(.el-menu-item) {
    padding: 0 20px;
  }
}
</style>