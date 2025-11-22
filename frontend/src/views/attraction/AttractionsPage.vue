<template>
  <div class="attractions-page">
    <!-- 顶部搜索筛选 -->
    <el-card class="filter-card" shadow="never">
      <el-form :model="filters" label-width="72px" @submit.prevent>
        <div class="filter-grid">
          <el-form-item label="城市">
            <el-input v-model="filters.city" placeholder="输入城市名，如 杭州" />
          </el-form-item>
          <el-form-item label="省份">
            <el-input v-model="filters.province" placeholder="输入省份，如 浙江" />
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="filters.keyword" placeholder="景点名称或简介关键字" />
          </el-form-item>
          <el-form-item label-width="0">
            <el-button type="primary" :loading="loading" @click="applyFilters">
              <el-icon><Search /></el-icon> 筛选
            </el-button>
            <el-button link @click="resetFilters">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <!-- 景点列表 -->
    <el-skeleton :loading="loading" animated :count="6">
      <template #template>
        <div class="grid">
          <el-skeleton-item v-for="n in 6" :key="n" variant="image" class="skeleton-card" />
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
              :style="{ backgroundImage: `url(${item.image_url || defaultCover})` }"
            >
              <span class="rating">
                <el-icon><StarFilled /></el-icon>
                {{ formatRating(item.rating) }}
              </span>
            </div>
            <div class="card-body">
              <div class="card-meta">
                <span>{{ item.city || '未知城市' }}</span>
                <span>·</span>
                <span>{{ item.province || '中国' }}</span>
              </div>
              <h3>{{ item.name }}</h3>
              <p class="description">
                {{ item.description || '这是一处热门景点，欢迎亲自探索。' }}
              </p>
              <div class="card-footer">
                <div class="price">
                  <small>门票</small>
                  <strong>¥{{ Number(item.ticket_price || 0).toFixed(0) }}</strong>
                </div>
                <div class="card-actions">
                  <!-- 收藏按钮 -->
                  <el-button size="small" :type="item.is_favorite ? 'primary' : 'default'" @click="toggleFavorite(item)">
                    <el-icon><Star /></el-icon>
                    {{ item.is_favorite ? '已收藏' : '收藏' }}
                  </el-button>
                  <!-- 点击跳转景点详情页 -->
                  <el-button size="small" @click="viewAttraction(item.id)">
                    了解详情
                  </el-button>
                </div>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else description="暂无景点" />
      </template>
    </el-skeleton>

    <!-- 分页按钮 -->
    <div v-if="hasMore" class="load-more">
      <el-button type="primary" :loading="loading" @click="loadMore">
        加载更多
      </el-button>
    </div>

    <!-- 弹窗提示 -->
    <transition name="fade-dialog">
      <el-dialog
        v-model="dialog.visible"
        :title="dialog.title"
        width="360px"
        destroy-on-close
        :show-close="false"
      >
        <p>{{ dialog.message }}</p>
        <template #footer>
          <el-button type="primary" @click="dialog.visible = false">确定</el-button>
        </template>
      </el-dialog>
    </transition>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { attractionApi, authApi } from '@/api';
import { useRouter } from 'vue-router';
import { Search, StarFilled, Star } from '@element-plus/icons-vue';

const router = useRouter();
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
    console.error('检查收藏状态失败:', error);
  }
};

const filters = reactive({
  city: '',
  province: '',
  keyword: '',
});

const attractions = ref([]);
const loading = ref(false);
const page = ref(1);
const limit = 12;
const hasMore = ref(true);
const defaultCover = '/Bali.avif';

// 弹窗提示
const dialog = reactive({
  visible: false,
  title: '提示',
  message: '',
});
const showDialog = (msg) => {
  dialog.message = msg;
  dialog.visible = true;
};

// 加载景点
const loadAttractions = async (reset = false) => {
  try {
    loading.value = true;
    if (reset) page.value = 1;
    const params = { ...filters, page: page.value, limit };
    const { data } = await attractionApi.list(params);
    const list = data?.data?.attractions || [];
    if (reset) attractions.value = list;
    else attractions.value.push(...list);

    hasMore.value = list.length === limit;
    
    // 检查登录状态
    await checkAuthStatus();
    // 检查新加载景点的收藏状态
    await checkFavoriteStatus(list);
  } catch (error) {
    showDialog('获取景点列表失败');
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => loadAttractions(true);
const resetFilters = () => {
  filters.city = '';
  filters.province = '';
  filters.keyword = '';
  loadAttractions(true);
};
const loadMore = () => {
  page.value++;
  loadAttractions();
};

// 点击跳转景点详情页
const viewAttraction = (id) => {
  if (!id) return;
  router.push({ name: 'AttractionDetail', params: { id } });
};

// 收藏/取消收藏景点
 const toggleFavorite = async (item) => {
   // 检查登录状态
   if (!isLoggedIn.value) {
     showDialog('请先登录后再收藏景点');
     return;
   }
   
   try {
     if (item.is_favorite) {
       await attractionApi.unfavorite(item.id);
       item.is_favorite = false;
       showDialog('已取消收藏');
     } else {
       await attractionApi.favorite(item.id);
       item.is_favorite = true;
       showDialog('收藏成功');
     }
   } catch (error) {
     showDialog('操作失败，请重试');
   }
 };

const formatRating = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num.toFixed(1) : '4.5';
};

onMounted(() => {
  loadAttractions(true);
});
</script>

<style scoped>
.attractions-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.filter-card {
  border-radius: 16px;
  margin-bottom: 32px;
  backdrop-filter: blur(8px);
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.attraction-card {
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

.card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.card-meta {
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

.card-footer {
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

.load-more {
  margin: 24px 0;
  text-align: center;
}

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
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
