<template>
  <div class="auth-wrapper">
    <el-card class="auth-card" shadow="never">
      <div class="auth-header">
        <h2>欢迎回来</h2>
        <p>登录后即可收藏喜欢的景点，发布评论互动</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名或邮箱"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="handleSubmit"
        >
          登录
        </el-button>
      </el-form>

      <p class="extra">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/auth';

const formRef = ref();
const loading = ref(false);
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const message = inject('message');

const form = reactive({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '请输入用户名或邮箱', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      loading.value = true;
      const { data } = await authApi.login(form);
      if (data?.success) {
        authStore.setAuth(data.data.token, data.data.user);
        message.success('登录成功');
        router.push(route.query.redirect || '/');
      }
    } catch (error) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<style scoped>
.auth-wrapper {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
}

.auth-card {
  width: min(420px, 100%);
  padding: 24px;
  border-radius: 16px;
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-header h2 {
  margin-bottom: 8px;
}

.submit-btn {
  width: 100%;
  margin-top: 8px;
}

.extra {
  text-align: center;
  margin-top: 16px;
  color: #667085;
}

.extra a {
  color: #409eff;
}
</style>

