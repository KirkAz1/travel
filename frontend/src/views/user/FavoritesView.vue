<template>
  <div class="favorites-page">
    <div class="page-header">
      <div>
        <h1>我的收藏</h1>
        <p>集中管理你喜爱的景点与游记</p>
      </div>
      <el-radio-group v-model="filterType" @change="loadFavorites">
        <el-radio-button label="all">全部</el-radio-button>
        <el-radio-button label="attraction">景点</el-radio-button>
        <el-radio-button label="travel_note">游记</el-radio-button>
      </el-radio-group>
    </div>

    <el-card class="favorite-card" shadow="never">
      <el-empty v-if="favorites.length === 0" description="还没有收藏内容" />

      <div v-else class="favorite-list">
        <article v-for="item in favorites" :key="item.id" class="favorite-item">
          <img :src="item.target_image || defaultCover" :alt="item.target_name" />
          <div class="content">
            <div class="tag">
              <el-tag size="small" type="info" round>
                {{ item.target_type === 'attraction' ? '景点' : '游记' }}
              </el-tag>
              <small>{{ formatDate(item.created_at) }}</small>
            </div>
            <h3>{{ item.target_name || '已下架内容' }}</h3>
            <div class="actions">
              <el-button
                v-if="item.target_type === 'travel_note'"
                type="primary"
                text
                @click="router.push(`/travel-notes/${item.target_id}`)"
              >
                查看游记
              </el-button>
              <el-button
                v-else
                text
                type="primary"
                @click="message.info('景点详情暂未实现，可关注游记内容哦')"
              >
                查看景点
              </el-button>
              <el-button text type="danger" @click="removeFavorite(item)">
                取消收藏
              </el-button>
            </div>
          </div>
        </article>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import dayjs from 'dayjs';
import { ElMessageBox } from 'element-plus';
import { favoriteApi } from '@/api';
import { useRouter } from 'vue-router';

const favorites = ref([]);
const filterType = ref('all');
const defaultCover = '/Switzerland.avif';
const router = useRouter();
const message = inject('message');

const loadFavorites = async () => {
  try {
    const params =
      filterType.value === 'all' ? {} : { target_type: filterType.value };
    const { data } = await favoriteApi.list(params);
    favorites.value = data?.data || [];
  } catch (error) {
    message.error('获取收藏失败');
  }
};

const removeFavorite = (item) => {
  ElMessageBox.confirm('确定要取消收藏吗？', '提示', {
    type: 'warning',
    confirmButtonText: '取消收藏',
    cancelButtonText: '再等等',
  })
    .then(async () => {
    await favoriteApi.remove({
      target_type: item.target_type,
      target_id: item.target_id,
    });
    message.success('已取消收藏');
    loadFavorites();
  })
  .catch(() => {});
};

const formatDate = (date) => dayjs(date).format('YYYY-MM-DD');

onMounted(() => {
  loadFavorites();
});
</script>

<style scoped>
.favorites-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.favorite-card {
  border-radius: 16px;
}

.favorite-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: flex;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.favorite-item:last-child {
  border-bottom: none;
}

.favorite-item img {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.content {
  flex: 1;
}

.tag {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 600px) {
  .favorite-item {
    flex-direction: column;
  }

  .favorite-item img {
    width: 100%;
    height: 200px;
  }
}
</style>

