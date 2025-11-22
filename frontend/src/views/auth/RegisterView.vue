<template>
  <div class="auth-wrapper">
    <el-card class="auth-card" shadow="never">
      <div class="auth-header">
        <h2>创建新账号</h2>
        <p>加入游迹全国，记录每一次心动出发</p>
      </div>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="至少6位密码"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirm">
          <el-input
            v-model="form.confirm"
            type="password"
            show-password
            placeholder="再次输入密码"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="submit-btn"
          :loading="loading"
          @click="handleSubmit"
        >
          注册
        </el-button>
      </el-form>

      <p class="extra">
        已有账号？
        <router-link to="/login">直接登录</router-link>
      </p>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { authApi } from '@/api';
import { useAuthStore } from '@/stores/auth';

const formRef = ref();
const loading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const message = inject('message');

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirm: '',
});

const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur', min: 6 }],
  confirm: [{ required: true, validator: validateConfirm, trigger: 'blur' }],
};

const handleSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (!valid) return;
    try {
      loading.value = true;
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
      };
      const { data } = await authApi.register(payload);
      if (data?.success) {
        authStore.setAuth(data.data.token, data.data.user);
        message.success('注册成功');
        router.push('/');
      }
    } catch (error) {
      message.error(error.response?.data?.message || '注册失败');
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

