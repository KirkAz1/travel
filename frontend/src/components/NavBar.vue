<template>
  <header class="nav-wrapper">
    <div class="nav-container">
      <router-link class="logo" to="/">
        <span class="logo-icon">✈️</span>
        <div class="logo-text">
          <strong>游迹全国</strong>
          <small>Travel Explorer</small>
        </div>
      </router-link>

      <div class="nav-links">
        <router-link to="/" exact-active-class="active">首页</router-link>
        <router-link to="/attractions" exact-active-class="active"
          >热门景点</router-link
        >
        <router-link to="/travel-notes" exact-active-class="active"
          >精选游记</router-link
        >
        <router-link
          v-if="authStore.state.token"
          to="/favorites"
          active-class="active"
          >我的收藏</router-link
        >
      </div>

      <div class="nav-actions">
        <el-button
          v-if="!authStore.state.token"
          class="login-btn"
          size="medium"
          round
          @click="goLogin"
        >
          登录
        </el-button>
        <el-button
          v-if="!authStore.state.token"
          class="register-btn"
          size="medium"
          round
          @click="goRegister"
        >
          注册
        </el-button>

        <div v-else class="user-actions">
          <el-dropdown>
            <div class="user-entry">
              <el-avatar :size="36" :src="authStore.state.user?.avatar">
                {{ authStore.state.user?.username?.[0] || "U" }}
              </el-avatar>
              <span class="username">{{ authStore.state.user?.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="router.push('/travel-notes/create')">
                  <el-icon><EditPen /></el-icon>
                  发布游记
                </el-dropdown-item>
                <el-dropdown-item divided @click="router.push('/favorites')">
                  <el-icon><StarFilled /></el-icon>
                  我的收藏
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  @click="router.push({ name: 'change-password-direct' })"
                >
                  <el-icon><Lock /></el-icon>
                  修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="showLogoutDialog">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <!-- 退出登录弹窗 -->
    <LogoutDialog v-model="logoutDialogVisible" @confirm="handleLogout" />
  </header>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import {
  ArrowDown,
  StarFilled,
  SwitchButton,
  Lock,
  EditPen,
} from "@element-plus/icons-vue";
import LogoutDialog from "./LogoutDialog.vue";

const authStore = useAuthStore();
const router = useRouter();
const logoutDialogVisible = ref(false);
const message = inject("message");

const goLogin = () => {
  router.push({ name: "login" });
};

const goRegister = () => {
  router.push({ name: "register" });
};

const showLogoutDialog = () => {
  logoutDialogVisible.value = true;
};

const handleLogout = () => {
  authStore.clearAuth();
  message.success("已退出登录");
  router.push("/");
};
</script>

<style scoped>
.nav-wrapper {
  background: transparent;
  padding: 16px 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  color: #fff;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  gap: 12px;
}

.logo-icon {
  font-size: 28px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-text strong {
  font-size: 16px;
}

.logo-text small {
  font-size: 12px;
  opacity: 0.8;
}

.nav-links {
  display: flex;
  gap: 18px;
  flex: 1;
}

.nav-links a,
.nav-links .router-link-active {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-links a:hover,
.nav-links .active {
  opacity: 0.8;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-entry {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  cursor: pointer;
}

.username {
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.login-btn {
  color: #fff !important;
  border-color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  font-weight: 500;
  padding: 8px 20px !important;
  transition: all 0.3s ease !important;
}

.login-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: #fff !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.register-btn {
  color: #9face6 !important;
  border-color: #fff !important;
  background: #fff !important;
  font-weight: 500;
  padding: 8px 20px !important;
  transition: all 0.3s ease !important;
}

.register-btn:hover {
  background: rgba(255, 255, 255, 0.9) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #ff7e5f !important;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 12px;
  }

  .nav-links {
    justify-content: center;
    flex-wrap: wrap;
  }

  .login-btn,
  .register-btn {
    padding: 6px 16px !important;
    font-size: 14px;
  }
}
</style>
