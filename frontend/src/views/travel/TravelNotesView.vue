<template>
  <div class="travel-notes-page">
    <section class="section-header">
      <p class="badge">真实故事</p>
      <h2>全部游记</h2>
    </section>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div class="grid">
          <el-skeleton-item v-for="n in 6" :key="n" variant="p" class="skeleton-note" />
        </div>
      </template>
      <template #default>
        <div v-if="notes.length" class="grid">
          <article v-for="note in notes" :key="note.id" class="travel-card">
            <img :src="note.cover_image || defaultCover" :alt="note.title" />
            <div class="travel-body">
              <h3>{{ note.title }}</h3>
              <p>{{ note.content.slice(0, 120) }}...</p>
              <el-button type="primary" text @click="router.push(`/travel-notes/${note.id}`)">
                查看游记
              </el-button>
            </div>
          </article>
        </div>
        <el-empty v-else description="暂无游记" />
      </template>
    </el-skeleton>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { travelNoteApi } from '@/api';

const router = useRouter();
const notes = ref([]);
const loading = ref(false);
const defaultCover = '/Bali.avif';

const loadNotes = async () => {
  try {
    loading.value = true;
    const { data } = await travelNoteApi.list({ limit: 50 }); // 可以分页
    notes.value = data?.data?.notes || [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadNotes();
});
</script>

<style scoped>
.travel-notes-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 16px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
.travel-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
}
.travel-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.travel-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-note {
  height: 280px;
}
</style>
