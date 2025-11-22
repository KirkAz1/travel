<template>
  <transition name="fade">
    <div v-if="visible" class="logout-dialog-overlay" @click="handleOverlayClick">
      <transition name="slide-fade">
        <div class="logout-dialog" @click.stop>
          <div class="dialog-header">
            <h3>退出登录</h3>
            <el-icon class="close-icon" @click="handleClose">
              <Close />
            </el-icon>
          </div>
          
          <div class="dialog-content">
            <p>确定要退出登录吗？</p>
          </div>
          
          <div class="dialog-actions">
            <el-button class="cancel-btn" @click="handleClose">
              取消
            </el-button>
            <el-button class="confirm-btn" type="primary" @click="handleConfirm">
              退出登录
            </el-button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(false)

watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

const handleOverlayClick = () => {
  handleClose()
}
</script>

<style scoped>
.logout-dialog-overlay {
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

.logout-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
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
  margin-bottom: 24px;
}

.dialog-content p {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-btn {
  color: #606266;
  border-color: #dcdfe6;
}

.cancel-btn:hover {
  color: #409eff;
  border-color: #409eff;
}

.confirm-btn {
  background: #ff4757;
  border-color: #ff4757;
}

.confirm-btn:hover {
  background: #ff2e43;
  border-color: #ff2e43;
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
  .logout-dialog {
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