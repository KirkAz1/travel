<template>
  <transition-group name="message-fade" tag="div" class="custom-message-container">
    <div 
      v-for="message in messages" 
      :key="message.id"
      class="custom-message"
      :class="message.type"
    >
      <div class="message-content">
        <el-icon class="message-icon">
          <component :is="getIcon(message.type)" />
        </el-icon>
        <span>{{ message.content }}</span>
      </div>
      <el-icon class="close-icon" @click="removeMessage(message.id)">
        <Close />
      </el-icon>
    </div>
  </transition-group>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  SuccessFilled, 
  WarningFilled, 
  InfoFilled, 
  CircleCloseFilled,
  Close 
} from '@element-plus/icons-vue'

const messages = ref([])
let messageId = 0

const getIcon = (type) => {
  const iconMap = {
    success: SuccessFilled,
    warning: WarningFilled,
    info: InfoFilled,
    error: CircleCloseFilled
  }
  return iconMap[type] || InfoFilled
}

const showMessage = (content, type = 'info', duration = 3000) => {
  const id = ++messageId
  const message = {
    id,
    content,
    type,
    duration
  }
  
  messages.value.push(message)
  
  setTimeout(() => {
    removeMessage(id)
  }, duration)
}

const removeMessage = (id) => {
  const index = messages.value.findIndex(msg => msg.id === id)
  if (index > -1) {
    messages.value.splice(index, 1)
  }
}

// 导出方法供全局使用
defineExpose({
  success: (content, duration) => showMessage(content, 'success', duration),
  error: (content, duration) => showMessage(content, 'error', duration),
  warning: (content, duration) => showMessage(content, 'warning', duration),
  info: (content, duration) => showMessage(content, 'info', duration)
})
</script>

<style scoped>
.custom-message-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  pointer-events: none;
}

.custom-message {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  padding: 16px 20px;
  margin-bottom: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: white;
  border-left: 4px solid #409eff;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.custom-message.success {
  border-left-color: #67c23a;
  background: linear-gradient(135deg, #f0f9eb 0%, #e1f3d8 100%);
}

.custom-message.error {
  border-left-color: #f56c6c;
  background: linear-gradient(135deg, #fef0f0 0%, #fde2e2 100%);
}

.custom-message.warning {
  border-left-color: #e6a23c;
  background: linear-gradient(135deg, #fdf6ec 0%, #faecd8 100%);
}

.custom-message.info {
  border-left-color: #909399;
  background: linear-gradient(135deg, #f4f4f5 0%, #e9e9eb 100%);
}

.message-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.message-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.custom-message.success .message-icon {
  color: #67c23a;
}

.custom-message.error .message-icon {
  color: #f56c6c;
}

.custom-message.warning .message-icon {
  color: #e6a23c;
}

.custom-message.info .message-icon {
  color: #909399;
}

.close-icon {
  cursor: pointer;
  color: #c0c4cc;
  font-size: 14px;
  transition: color 0.2s ease;
  flex-shrink: 0;
  margin-left: 12px;
}

.close-icon:hover {
  color: #909399;
}

/* 淡入淡出动画 */
.message-fade-enter-active {
  transition: all 0.3s ease-out;
}

.message-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.message-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.message-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .custom-message-container {
    right: 10px;
    left: 10px;
  }
  
  .custom-message {
    min-width: unset;
    width: 100%;
  }
}
</style>