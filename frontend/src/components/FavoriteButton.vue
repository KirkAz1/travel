<template>
  <el-button
    :type="isFavorited ? 'primary' : 'default'"
    :loading="loading"
    :size="size"
    :circle="circle"
    @click="handleToggle"
    class="favorite-btn"
  >
    <el-icon>
      <Star v-if="isFavorited" />
      <StarFilled v-else />
    </el-icon>
    <span v-if="showText">{{ isFavorited ? '已收藏' : '收藏' }}</span>
  </el-button>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { Star, StarFilled } from '@element-plus/icons-vue';
import { favoriteApi } from '@/api';

const props = defineProps({
  targetType: {
    type: String,
    required: true,
    validator: (value) => ['attraction', 'travel_note'].includes(value)
  },
  targetId: {
    type: [String, Number],
    required: true
  },
  size: {
    type: String,
    default: 'default'
  },
  circle: {
    type: Boolean,
    default: false
  },
  showText: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['change']);

const isFavorited = ref(false);
const loading = ref(false);

// 检查收藏状态
const checkFavoriteStatus = async () => {
  try {
    const { data } = await favoriteApi.check({
      target_type: props.targetType,
      target_id: props.targetId
    });
    isFavorited.value = data?.data?.is_favorited || false;
  } catch (error) {
    console.error('检查收藏状态失败:', error);
    isFavorited.value = false;
  }
};

// 切换收藏状态
const handleToggle = async () => {
  if (loading.value) return;
  
  try {
    loading.value = true;
    
    if (isFavorited.value) {
      // 取消收藏
      await favoriteApi.remove({
        target_type: props.targetType,
        target_id: props.targetId
      });
      isFavorited.value = false;
      ElMessage.success('取消收藏成功');
    } else {
      // 添加收藏
      await favoriteApi.add({
        target_type: props.targetType,
        target_id: props.targetId
      });
      isFavorited.value = true;
      ElMessage.success('收藏成功');
    }
    
    emit('change', isFavorited.value);
  } catch (error) {
    console.error('切换收藏状态失败:', error);
    ElMessage.error(error.response?.data?.message || '操作失败，请重试');
  } finally {
    loading.value = false;
  }
};

// 监听props变化
watch(
  () => [props.targetType, props.targetId],
  () => {
    if (props.targetType && props.targetId) {
      checkFavoriteStatus();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.favorite-btn {
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  transform: scale(1.05);
}

.favorite-btn:active {
  transform: scale(0.95);
}
</style>