<template>
  <div class="create-travel-note-container">
    <!-- 发布成功弹窗 -->
    <transition name="fade">
      <div
        v-if="successDialogVisible"
        class="success-dialog-overlay"
        @click="handleOverlayClick"
      >
        <transition name="slide-fade">
          <div class="success-dialog" @click.stop>
            <div class="dialog-header">
              <h3>发布成功</h3>
              <el-icon class="close-icon" @click="handleCloseDialog">
                <Close />
              </el-icon>
            </div>

            <div class="dialog-content">
              <el-icon class="success-icon" color="#67c23a">
                <SuccessFilled />
              </el-icon>
              <p>游记发布成功！</p>
            </div>

            <div class="dialog-actions">
              <el-button class="cancel-btn" @click="handleContinuePublish">
                继续发布
              </el-button>
              <el-button
                class="confirm-btn"
                type="primary"
                @click="handleViewNotes"
              >
                查看游记
              </el-button>
            </div>
          </div>
        </transition>
      </div>
    </transition>

    <div class="create-travel-note-form">
      <h2>发布游记</h2>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="游记标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入游记标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="封面图片" prop="cover_image">
          <el-input
            v-model="form.cover_image"
            placeholder="请输入封面图片URL"
          />
        </el-form-item>

        <el-form-item label="关联景点" prop="attraction_name">
          <el-input
            v-model="form.attraction_name"
            placeholder="请输入关联景点名称（可选）"
            maxlength="100"
          />
        </el-form-item>

        <el-form-item label="游记内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="请详细描述您的旅行经历..."
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            发布游记
          </el-button>
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
import { travelNoteApi, attractionApi } from "@/api";
import { useAuthStore } from "@/stores/auth";
import { Close, SuccessFilled } from "@element-plus/icons-vue";

const authStore = useAuthStore();
const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const successDialogVisible = ref(false);

// 检查用户是否已登录
onMounted(() => {
  if (!authStore.state.token) {
    ElMessage.warning("请先登录");
    router.push("/login");
  }
});

const form = reactive({
  title: "",
  content: "",
  cover_image: "",
  attraction_name: "",
});

const rules = {
  title: [
    { required: true, message: "请输入游记标题", trigger: "blur" },
    { min: 2, max: 100, message: "标题长度在2-100个字符之间", trigger: "blur" },
  ],
  content: [
    { required: true, message: "请输入游记内容", trigger: "blur" },
    {
      min: 10,
      max: 5000,
      message: "内容长度在10-5000个字符之间",
      trigger: "blur",
    },
  ],
  cover_image: [
    { type: "url", message: "请输入有效的图片URL", trigger: "blur" },
  ],
};

const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    loading.value = true;

    // 构建提交数据
    const submitData = {
      title: form.title,
      content: form.content,
      cover_image: form.cover_image || null,
    };

    // 如果用户输入了景点名称，查找对应的景点ID
    if (form.attraction_name.trim()) {
      try {
        const { data } = await attractionApi.list({
          keyword: form.attraction_name.trim(),
        });
        const attractions = data?.data?.attractions || [];

        // 查找匹配的景点
        const matchedAttraction = attractions.find(
          (attraction) =>
            attraction.name.includes(form.attraction_name.trim()) ||
            form.attraction_name.trim().includes(attraction.name)
        );

        if (matchedAttraction) {
          submitData.attraction_id = matchedAttraction.id;
        } else {
          ElMessage.warning(
            `未找到景点"${form.attraction_name}"，将不关联景点`
          );
        }
      } catch (error) {
        console.error("查找景点错误:", error);
        ElMessage.warning("景点查找失败，将不关联景点");
      }
    }

    const response = await travelNoteApi.create(submitData);

    if (response.data.success) {
      // 显示成功弹窗
      successDialogVisible.value = true;
    }
  } catch (error) {
    console.error("发布游记错误:", error);
    ElMessage.error(error.response?.data?.message || "游记发布失败");
  } finally {
    loading.value = false;
  }
};

const handleCancel = () => {
  router.back();
};

// 弹窗相关函数
const handleViewNotes = () => {
  // 跳转到精选游记页面
  router.push("/travel-notes");
  successDialogVisible.value = false;
};

const handleContinuePublish = () => {
  // 重置表单，继续发布
  formRef.value?.resetFields();
  successDialogVisible.value = false;
};

const handleCloseDialog = () => {
  successDialogVisible.value = false;
};

const handleOverlayClick = () => {
  handleCloseDialog();
};
</script>

<style scoped>
.create-travel-note-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.create-travel-note-form {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.create-travel-note-form h2 {
  margin-bottom: 30px;
  text-align: center;
  color: #303133;
}

/* 成功弹窗样式 */
.success-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.success-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.close-icon {
  cursor: pointer;
  color: #909399;
  font-size: 18px;
  transition: color 0.2s ease;
}

.close-icon:hover {
  color: #606266;
}

.dialog-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  text-align: center;
}

.success-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.dialog-content p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.cancel-btn {
  color: #606266;
  border-color: #dcdfe6;
  min-width: 100px;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #409eff;
}

.confirm-btn {
  background: #67c23a;
  border-color: #67c23a;
  min-width: 100px;
}

.confirm-btn:hover {
  background: #5daf34;
  border-color: #5daf34;
}

/* 淡入淡出效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动淡入淡出效果 */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .success-dialog {
    min-width: unset;
    width: 90vw;
    margin: 20px;
    padding: 20px;
  }

  .dialog-actions {
    flex-direction: column;
  }

  .dialog-actions .el-button {
    width: 100%;
  }
}
</style>
