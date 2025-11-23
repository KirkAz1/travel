<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section" id="hero">
      <div class="hero-content">
        <p class="badge">发现世界 · 遇见心动目的地</p>
        <h1>启程吧，一起探索<span>全国旅行灵感</span></h1>
        <p class="subtitle">
          精选国内热门景点、真实游记与旅拍攻略，助你轻松规划下一次旅行。
        </p>

        <el-card class="filter-card" shadow="never">
          <el-form :model="filters" label-width="72px" @submit.prevent>
            <div class="filter-grid">
              <el-form-item label="城市">
                <el-input
                  v-model="filters.city"
                  placeholder="输入城市名，如 杭州"
                />
              </el-form-item>
              <el-form-item label="省份">
                <el-input
                  v-model="filters.province"
                  placeholder="输入省份，如 浙江"
                />
              </el-form-item>
              <el-form-item label="关键词">
                <el-input
                  v-model="filters.keyword"
                  placeholder="景点名称或简介关键字"
                />
              </el-form-item>
              <el-form-item label-width="0">
                <el-button
                  type="primary"
                  :loading="loadingAttractions"
                  @click="loadAttractions"
                >
                  <el-icon><Search /></el-icon>
                  智能筛选
                </el-button>
                <el-button link @click="resetFilters">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </el-card>
      </div>
    </section>

    <!-- Attractions Section -->
    <section class="content-section" id="attractions">
      <div class="section-header">
        <div>
          <p class="badge">人气景点</p>
          <h2>热门目的地</h2>
        </div>
        <!-- 跳转到热门景点页面 -->
        <el-button
          text
          type="primary"
          @click="router.push({ name: 'attractions' })"
        >
          查看更多
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <el-skeleton :loading="loadingAttractions" animated :count="4">
        <template #template>
          <div class="grid">
            <el-skeleton-item
              v-for="n in 4"
              :key="n"
              variant="image"
              class="skeleton-card"
            />
          </div>
        </template>

        <template #default>
          <div v-if="attractions.length" class="grid">
            <article
              v-for="item in attractions"
              :key="item.id"
              class="attraction-card"
            >
              <div
                class="cover"
                :style="{
                  backgroundImage: `url(${item.image_url || defaultCover})`,
                }"
              >
                <span class="rating">
                  <el-icon><StarFilled /></el-icon>
                  {{ formatRating(item.rating) }}
                </span>
              </div>
              <div class="card-body">
                <div class="card-meta">
                  <span>{{ item.city || "未知城市" }}</span>
                  <span>·</span>
                  <span>{{ item.province || "中国" }}</span>
                </div>
                <h3>{{ item.name }}</h3>
                <p class="description">
                  {{ item.description || "这是一处热门景点，欢迎亲自探索。" }}
                </p>
                <div class="card-footer">
                  <div class="price">
                    <small>门票</small>
                    <strong
                      >¥{{ Number(item.ticket_price || 0).toFixed(0) }}</strong
                    >
                  </div>
                  <div class="card-actions">
                    <!-- 收藏按钮 -->
                    <el-button
                      size="small"
                      :type="item.is_favorite ? 'primary' : 'default'"
                      @click="toggleFavorite(item)"
                    >
                      <el-icon><Star /></el-icon>
                      {{ item.is_favorite ? "已收藏" : "收藏" }}
                    </el-button>
                    <!-- 了解详情按钮 -->
                    <el-button size="small" @click="viewAttraction(item.id)">
                      了解详情
                    </el-button>
                  </div>
                </div>
              </div>
            </article>
          </div>
          <el-empty v-else description="暂未找到符合条件的景点" />
        </template>
      </el-skeleton>
    </section>

    <!-- Travel Notes Section -->
    <section class="content-section" id="travel-notes">
      <div class="section-header">
        <div>
          <p class="badge">真实故事</p>
          <h2>精选游记</h2>
        </div>
        <!-- 查看更多按钮 -->
        <el-button
          text
          type="primary"
          @click="router.push({ name: 'travel-notes' })"
        >
          查看更多
          <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>

      <el-skeleton :loading="loadingTravelNotes" animated>
        <template #template>
          <div class="grid travel-grid">
            <el-skeleton-item
              v-for="n in 3"
              :key="n"
              variant="p"
              class="skeleton-note"
            />
          </div>
        </template>

        <template #default>
          <div v-if="travelNotes.length" class="grid travel-grid">
            <article
              v-for="note in travelNotes"
              :key="note.id"
              class="travel-card"
            >
              <img :src="note.cover_image || defaultCover" :alt="note.title" />
              <div class="travel-body">
                <div class="note-meta">
                  <span>{{ note.username }}</span>
                  <span>·</span>
                  <span>{{ formatDate(note.created_at) }}</span>
                </div>
                <h3>{{ note.title }}</h3>
                <p>{{ note.content.slice(0, 120) }}...</p>
                <div class="note-footer">
                  <div class="stats">
                    <span
                      ><el-icon><View /></el-icon>{{ note.views }}</span
                    >
                    <span
                      ><el-icon><Pointer /></el-icon>{{ note.likes }}</span
                    >
                  </div>
                </div>
                <el-button
                  type="primary"
                  text
                  @click="router.push(`/travel-notes/${note.id}`)"
                >
                  查看游记
                </el-button>
              </div>
            </article>
          </div>
          <el-empty v-else description="暂无游记" />
        </template>
      </el-skeleton>
    </section>

    <!-- 居中淡入淡出弹窗 -->
    <transition name="fade-dialog">
      <el-dialog
        v-model="msgDialogVisible"
        title=""
        width="360px"
        destroy-on-close
        :show-close="false"
        center
      >
        <div>{{ msgDialogText }}</div>
        <template #footer>
          <el-button type="primary" @click="msgDialogVisible = false">
            确定
          </el-button>
        </template>
      </el-dialog>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import { attractionApi, travelNoteApi, authApi } from "@/api";
import {
  ArrowRight,
  Pointer,
  Search,
  StarFilled,
  View,
  Star,
} from "@element-plus/icons-vue";

const router = useRouter();
const filters = reactive({ city: "", province: "", keyword: "" });
const attractions = ref([]);
const travelNotes = ref([]);
const loadingAttractions = ref(false);
const loadingTravelNotes = ref(false);
const defaultCover = "/Bali.avif";
const isLoggedIn = ref(false);

// 检查登录状态
const checkAuthStatus = async () => {
  try {
    await authApi.me();
    isLoggedIn.value = true;
  } catch (error) {
    isLoggedIn.value = false;
  }
};

// 检查景点收藏状态
const checkFavoriteStatus = async (attractions) => {
  if (!isLoggedIn.value) return;

  try {
    for (const attraction of attractions) {
      const response = await attractionApi.checkFavorite(attraction.id);
      attraction.is_favorite = response.data.is_favorite || false;
    }
  } catch (error) {
    console.error("检查收藏状态失败:", error);
  }
};

const msgDialogVisible = ref(false);
const msgDialogText = ref("");
const msgDialogType = ref("info");

const showMessage = (msg, type = "info") => {
  msgDialogText.value = msg;
  msgDialogType.value = type;
  msgDialogVisible.value = true;
};

const loadAttractions = async () => {
  try {
    loadingAttractions.value = true;
    const params = { ...filters, limit: 8 };
    const { data } = await attractionApi.list(params);
    attractions.value = data?.data?.attractions || [];

    // 检查登录状态和收藏状态
    await checkAuthStatus();
    await checkFavoriteStatus(attractions.value);
  } catch (error) {
    showMessage("获取景点列表失败", "error");
  } finally {
    loadingAttractions.value = false;
  }
};

const loadTravelNotes = async () => {
  try {
    loadingTravelNotes.value = true;
    const { data } = await travelNoteApi.list({ limit: 6 });
    travelNotes.value = data?.data?.notes || [];
  } catch (error) {
    showMessage("获取游记失败", "error");
  } finally {
    loadingTravelNotes.value = false;
  }
};

const resetFilters = () => {
  filters.city = "";
  filters.province = "";
  filters.keyword = "";
  loadAttractions();
};

const viewAttraction = (id) => {
  router.push({ name: "AttractionDetail", params: { id } });
};

// 收藏/取消收藏景点
const toggleFavorite = async (item) => {
  // 检查登录状态
  if (!isLoggedIn.value) {
    showMessage("请先登录后再收藏景点", "warning");
    return;
  }

  try {
    if (item.is_favorite) {
      await attractionApi.unfavorite(item.id);
      item.is_favorite = false;
      showMessage("已取消收藏", "success");
    } else {
      await attractionApi.favorite(item.id);
      item.is_favorite = true;
      showMessage("收藏成功", "success");
    }
  } catch (error) {
    showMessage("操作失败，请重试", "error");
  }
};

const formatDate = (date) => dayjs(date).format("YYYY年MM月DD日");
const formatRating = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(1) : "4.5";
};

onMounted(() => {
  loadAttractions();
  loadTravelNotes();
});
</script>

<style scoped>
/* 保持原有样式 */
.home-page {
  background-color: #f7f8fc;
}
.hero-section {
  background-image: url("/search-background.avif");
  background-size: cover;
  background-position: center;
  padding: 80px 0 120px;
  color: #fff;
}
.hero-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  font-size: 13px;
  margin-bottom: 12px;
}
.hero-content h1 {
  font-size: clamp(32px, 6vw, 48px);
  margin-bottom: 16px;
}
.hero-content h1 span {
  color: #ffd866;
}
.subtitle {
  max-width: 640px;
  line-height: 1.6;
  margin-bottom: 32px;
}
.filter-card {
  border-radius: 16px;
  margin-top: 24px;
  backdrop-filter: blur(8px);
}
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}
.content-section {
  max-width: 1200px;
  margin: -80px auto 32px;
  padding: 120px 24px 0;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}
.attraction-card,
.travel-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(16, 24, 40, 0.08);
  display: flex;
  flex-direction: column;
}
.cover {
  height: 180px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.rating {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 4px 10px;
  border-radius: 999px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
}
.card-body,
.travel-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}
.card-meta,
.note-meta {
  color: #94a3b8;
  font-size: 14px;
  display: flex;
  gap: 6px;
}
.description {
  color: #475467;
  line-height: 1.5;
  flex: 1;
}
.card-footer,
.note-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.price small {
  display: block;
  color: #94a3b8;
  font-size: 12px;
}
.price strong {
  font-size: 20px;
}
.travel-grid {
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
.travel-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 修复精选游记浏览量和点赞量间距问题 */
.stats {
  display: flex;
  align-items: center;
  gap: 16px; /* 增加图标和数字之间的间距 */
}

.stats span {
  display: flex;
  align-items: center;
  gap: 6px; /* 图标和数字之间的间距 */
  color: #64748b;
  font-size: 14px;
}

.stats .el-icon {
  font-size: 16px;
  color: #94a3b8;
}

/* 弹窗淡入淡出动画 */
.fade-dialog-enter-active,
.fade-dialog-leave-active {
  transition: opacity 0.25s ease;
}
.fade-dialog-enter-from,
.fade-dialog-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .content-section {
    padding-top: 80px;
  }
}
</style>
