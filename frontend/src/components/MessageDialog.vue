<template>
  <transition name="fade-dialog">
    <el-dialog
      v-if="visible"
      :title="title"
      width="360px"
      destroy-on-close
      :show-close="false"
      :modal-append-to-body="true"
    >
      <span>{{ message }}</span>
      <template #footer>
        <el-button v-if="type === 'confirm'" @click="close">取消</el-button>
        <el-button type="primary" @click="confirmClick">{{ confirmText }}</el-button>
      </template>
    </el-dialog>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  message: { type: String, default: '' },
  title: { type: String, default: '' },
  type: { type: String, default: 'info' }, // info 或 confirm
  confirmText: { type: String, default: '确定' }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

const close = () => {
  visible.value = false;
  emit('update:modelValue', false);
};

const confirmClick = () => {
  emit('confirm');
  close();
};
</script>

<style scoped>
.fade-dialog-enter-active,
.fade-dialog-leave-active {
  transition: opacity 0.25s ease;
}
.fade-dialog-enter-from,
.fade-dialog-leave-to {
  opacity: 0;
}
</style>
