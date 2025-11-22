<template>
  <div class="detail-page" v-loading="loading">
    <el-page-header @back="router.back()" content="景点详情" />

    <div v-if="attraction" class="detail-container">
      <div class="hero">
        <img
          :src="attraction.image_url || defaultCover"
          :alt="attraction.name"
        />
        <div class="hero-content">
          <div class="meta">
            <span>{{ attraction.city || "未知城市" }}</span>
            <span>·</span>
            <span>{{ attraction.province || "中国" }}</span>
            <span>·</span>
            <span>{{
              attraction.rating
                ? formatRating(attraction.rating) + "⭐"
                : "暂无评分"
            }}</span>
          </div>
          <h1>{{ attraction.name }}</h1>
          <p>{{ attraction.description || "景点简介暂未提供" }}</p>
        </div>
      </div>

      <el-card class="content-card" shadow="never">
        <article class="note-content">
          <p>
            <strong>门票：</strong
            >{{
              attraction.ticket_price ? "¥" + attraction.ticket_price : "免费"
            }}
          </p>
          <p>
            <strong>开放时间：</strong
            >{{ attraction.opening_hours || "暂无信息" }}
          </p>
          <p><strong>地址：</strong>{{ attraction.address || "暂无信息" }}</p>
          <p>{{ attraction.long_description || "景点详细信息暂未提供" }}</p>
        </article>
      </el-card>
    </div>

    <el-empty v-else description="暂无景点信息" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { attractionApi } from "@/api";

const route = useRoute();
const router = useRouter();

const attraction = ref(null);
const loading = ref(false);
const defaultCover = "/Bali.avif";

const formatRating = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(1) : "4.5";
};

const loadAttraction = async () => {
  try {
    loading.value = true;
    const { data } = await attractionApi.get(route.params.id);
    attraction.value = data?.data || null;
  } catch (error) {
    console.error("获取景点详情失败", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadAttraction();
});
</script>

<style scoped>
.detail-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}
.detail-container {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.hero {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hero img {
  width: 100%;
  height: 360px;
  border-radius: 24px;
  object-fit: cover;
}
.hero-content {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}
.meta {
  color: #94a3b8;
  display: flex;
  gap: 6px;
  font-size: 14px;
}
.hero-content h1 {
  margin: 12px 0;
}
.content-card {
  border-radius: 16px;
}
.note-content {
  line-height: 1.8;
  color: #475467;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (max-width: 768px) {
  .hero img {
    height: 220px;
  }
}
</style>
