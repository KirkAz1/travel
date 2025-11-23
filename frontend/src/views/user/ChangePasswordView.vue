<template>
  <div class="change-password-container">
    <div class="change-password-form">
      <h2>修改密码</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="form.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="请确认新密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading"
            >确认修改</el-button
          >
          <el-button @click="handleCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { authApi } from "@/api/index";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const authStore = useAuthStore();

// 检查用户是否已登录
onMounted(() => {
  if (!authStore.state.token) {
    ElMessage.warning("请先登录");
    router.push("/login");
  }
});

const form = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = {
  currentPassword: [
    { required: true, message: "请输入当前密码", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "新密码长度至少为6位", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value === form.currentPassword) {
          callback(new Error("新密码不能与当前密码相同"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    // 调试信息
    console.log("当前token:", localStorage.getItem("travel_token"));
    console.log("认证状态:", authStore.state.token ? "已登录" : "未登录");

    const { data } = await authApi.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword,
    });

    // 后端返回 success: false
    if (!data?.success) {
      ElMessage.error(data?.message || "密码修改失败");
      return;
    }

    ElMessage.success("密码修改成功，请重新登录");

    // 清除登录信息
    authStore.clearAuth();

    // 跳到登录页
    setTimeout(() => {
      router.replace("/login");
    }, 50);
  } catch (error) {
    console.error("修改密码错误:", error);
    ElMessage.error(error.response?.data?.message || "密码修改失败");
  } finally {
    loading.value = false;
  }
};


const handleCancel = () => {
  router.back();
};
</script>

<style scoped>
.change-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
  background-color: #f5f7fa;
}

.change-password-form {
  width: 100%;
  max-width: 500px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.change-password-form h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #303133;
}
</style>
