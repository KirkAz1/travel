<template>
  <div class="detail-page" v-loading="loading">
    <el-page-header @back="router.back()" content="游记详情" />

    <div v-if="note" class="detail-container">
      <div class="hero">
        <img :src="note.cover_image || defaultCover" :alt="note.title" />
        <div class="hero-content">
          <div class="meta">
            <span>{{ note.username }}</span>
            <span>·</span>
            <span>{{ formatDate(note.created_at) }}</span>
            <span>·</span>
            <span>{{ note.attraction_name || "自由行" }}</span>
          </div>
          <h1>{{ note.title }}</h1>
          <p>{{ note.attraction_location || "旅途随记" }}</p>
          <div class="hero-actions">
            <el-button
              type="primary"
              :icon="isLiked ? Pointer : Pointer"
              plain
              @click="toggleLikeNote"
              :loading="likeLoading"
            >
              {{ isLiked ? "已点赞" : "点赞" }} ({{ note.likes }})
            </el-button>
            <el-button
              :type="isFavorited ? 'success' : 'default'"
              :loading="favoriteLoading"
              @click="toggleFavoriteNote"
            >
              <el-icon><Star /></el-icon>
              {{ isFavorited ? "已收藏" : "收藏" }}
            </el-button>
            <el-button
              v-if="authStore.state.user?.id === note.user_id"
              type="danger"
              plain
              @click="openDeleteTravelNoteDialog"
              :loading="deleteLoading"
            >
              <el-icon><Delete /></el-icon>
              删除游记
            </el-button>
          </div>
        </div>
      </div>

      <el-card class="content-card" shadow="never">
        <article class="note-content">
          <p v-for="(paragraph, idx) in formattedContent" :key="idx">
            {{ paragraph }}
          </p>
        </article>
      </el-card>

      <el-card class="comment-card" shadow="never">
        <div class="comment-header">
          <h3>评论区</h3>
          <p>分享你的旅行感受吧</p>
        </div>

        <div v-if="authStore.state.token" class="comment-editor">
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="3"
            maxlength="500"
            show-word-limit
            placeholder="写下你的评论..."
          />
          <el-button
            type="primary"
            class="comment-btn"
            :loading="commentLoading"
            @click="submitComment"
          >
            发布评论
          </el-button>
        </div>
        <div v-else class="comment-placeholder">
          <el-button type="primary" @click="router.push('/login')">
            登录后参与讨论
          </el-button>
        </div>

        <el-divider />

        <el-empty
          v-if="comments.length === 0"
          description="还没有评论，快来抢沙发吧"
        />

        <div v-else class="comment-list">
          <article
            v-for="comment in comments"
            :key="comment.id"
            class="comment-item"
          >
            <div class="comment-header-line">
              <strong>{{ comment.username }}</strong>
              <span>{{ formatDate(comment.created_at) }}</span>
            </div>
            <p>{{ comment.content }}</p>
            <div
              class="comment-actions"
              v-if="comment.user_id === authStore.state.user?.id"
            >
              <el-button
                text
                size="small"
                type="danger"
                @click="openDeleteDialog(comment.id)"
              >
                删除
              </el-button>
            </div>

            <div v-if="comment.replies?.length" class="reply-list">
              <article
                v-for="reply in comment.replies"
                :key="reply.id"
                class="reply-item"
              >
                <div class="comment-header-line">
                  <strong>{{ reply.username }}</strong>
                  <span>{{ formatDate(reply.created_at) }}</span>
                </div>
                <p>{{ reply.content }}</p>
              </article>
            </div>
          </article>
        </div>
      </el-card>
    </div>

    <!-- 删除确认弹窗 + 动画 -->
    <transition name="fade-dialog">
      <el-dialog
        v-model="deleteDialogVisible"
        title="确认删除"
        width="360px"
        destroy-on-close
      >
        <span>确定要删除这条评论吗？</span>

        <template #footer>
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="danger" @click="confirmDelete">删除</el-button>
        </template>
      </el-dialog>
    </transition>

    <!-- 通用成功提示弹窗 + 动画 -->
    <transition name="fade-dialog">
      <el-dialog
        v-model="successDialogVisible"
        title="提示"
        width="360px"
        destroy-on-close
        :show-close="false"
      >
        <span>{{ successMessage }}</span>
        <template #footer>
          <el-button type="primary" @click="successDialogVisible = false">
            确定
          </el-button>
        </template>
      </el-dialog>
    </transition>

    <!-- 删除游记确认弹窗 + 动画 -->
    <transition name="fade-dialog">
      <el-dialog
        v-model="deleteTravelNoteDialogVisible"
        title="删除确认"
        width="400px"
        destroy-on-close
      >
        <div style="text-align: center; padding: 20px 0">
          <el-icon size="48" color="#e6a23c"><Warning /></el-icon>
          <p style="margin: 16px 0; font-size: 16px; color: #606266">
            确定要删除这篇游记吗？
          </p>
          <p style="margin: 0; font-size: 14px; color: #909399">
            此操作不可恢复
          </p>
        </div>
        <template #footer>
          <el-button @click="deleteTravelNoteDialogVisible = false"
            >取消</el-button
          >
          <el-button
            type="danger"
            @click="deleteTravelNote"
            :loading="deleteLoading"
          >
            确定删除
          </el-button>
        </template>
      </el-dialog>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";
import { travelNoteApi, commentApi, favoriteApi, likeApi } from "@/api";
import { useAuthStore } from "@/stores/auth";
import { Pointer, Star, Delete, Warning } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const note = ref(null);
const comments = ref([]);
const loading = ref(false);
const commentLoading = ref(false);
const commentContent = ref("");
const defaultCover = "/Thailand.avif";
const isFavorited = ref(false);
const favoriteLoading = ref(false);
const isLiked = ref(false);
const likeLoading = ref(false);
const deleteDialogVisible = ref(false);
const deleteTargetId = ref(null);
const deleteLoading = ref(false);
const deleteTravelNoteDialogVisible = ref(false);

// 通用成功弹窗
const successDialogVisible = ref(false);
const successMessage = ref("");

const formattedContent = computed(() => {
  if (!note.value?.content) return [];
  return note.value.content.split(/\n+/).filter(Boolean);
});

const loadNote = async () => {
  try {
    loading.value = true;
    const { data } = await travelNoteApi.get(route.params.id);
    if (data?.success) {
      note.value = data.data;
    }
  } catch (error) {
    showSuccess("获取游记失败");
  } finally {
    loading.value = false;
  }
};

const loadComments = async () => {
  try {
    const { data } = await commentApi.list({
      target_type: "travel_note",
      target_id: route.params.id,
    });
    comments.value = data?.data || [];
  } catch (error) {
    showSuccess("加载评论失败");
  }
};

const loadFavoriteState = async () => {
  if (!authStore.state.token) return;
  try {
    const { data } = await favoriteApi.check({
      target_type: "travel_note",
      target_id: route.params.id,
    });
    isFavorited.value = data?.data?.is_favorited;
  } catch (error) {
    console.error(error);
  }
};

const loadLikeState = async () => {
  if (!authStore.state.token) return;
  try {
    const { data } = await likeApi.check({
      target_type: "travel_note",
      target_id: route.params.id,
    });
    isLiked.value = data?.data?.is_liked;
  } catch (error) {
    console.error(error);
  }
};

const toggleFavoriteNote = async () => {
  if (!authStore.state.token) {
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }
  try {
    favoriteLoading.value = true;
    const payload = {
      target_type: "travel_note",
      target_id: route.params.id,
    };
    if (isFavorited.value) {
      await favoriteApi.remove(payload);
      isFavorited.value = false;
      showSuccess("已取消收藏");
    } else {
      await favoriteApi.add(payload);
      isFavorited.value = true;
      showSuccess("收藏成功");
    }
  } catch (error) {
    showSuccess("操作失败");
  } finally {
    favoriteLoading.value = false;
  }
};

const toggleLikeNote = async () => {
  if (!authStore.state.token) {
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }
  try {
    likeLoading.value = true;
    const payload = {
      target_type: "travel_note",
      target_id: route.params.id,
    };
    const { data } = await likeApi.toggle(payload);
    isLiked.value = data?.data?.is_liked;
    note.value.likes += isLiked.value ? 1 : -1;
  } catch (error) {
    showSuccess("操作失败");
  } finally {
    likeLoading.value = false;
  }
};

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    showSuccess("请输入评论内容");
    return;
  }
  try {
    commentLoading.value = true;
    await commentApi.create({
      target_type: "travel_note",
      target_id: route.params.id,
      content: commentContent.value.trim(),
    });
    commentContent.value = "";
    showSuccess("评论成功");
    loadComments();
  } catch (error) {
    showSuccess(error.response?.data?.message || "评论失败");
  } finally {
    commentLoading.value = false;
  }
};

const openDeleteDialog = (commentId) => {
  deleteTargetId.value = commentId;
  deleteDialogVisible.value = true;
};

const confirmDelete = async () => {
  try {
    await commentApi.remove(deleteTargetId.value);
    successMessage.value = "评论删除成功";
    successDialogVisible.value = true;
    deleteDialogVisible.value = false;
    loadComments();
  } catch (error) {
    console.error("删除评论错误:", error);
    ElMessage.error(error.response?.data?.message || "删除失败");
  }
};

// 删除游记相关函数
const openDeleteTravelNoteDialog = () => {
  deleteTravelNoteDialogVisible.value = true;
};

const deleteTravelNote = async () => {
  try {
    deleteLoading.value = true;
    const response = await travelNoteApi.remove(route.params.id);

    if (response.data.success) {
      ElMessage.success("游记删除成功");
      deleteTravelNoteDialogVisible.value = false;
      router.push("/travel-notes");
    }
  } catch (error) {
    console.error("删除游记错误:", error);
    const errorMessage = error.response?.data?.message || "删除失败";

    if (error.response?.data?.error_code === "FORBIDDEN") {
      ElMessage.error("无权删除此游记");
    } else if (error.response?.data?.error_code === "NOTE_NOT_FOUND") {
      ElMessage.error("游记不存在");
    } else {
      ElMessage.error(errorMessage);
    }
  } finally {
    deleteLoading.value = false;
  }
};

const formatDate = (date) => {
  return dayjs(date).format("YYYY-MM-DD HH:mm");
};

const showSuccess = (msg) => {
  successMessage.value = msg;
  successDialogVisible.value = true;
};

onMounted(async () => {
  await loadNote();
  loadComments();
  loadFavoriteState();
  loadLikeState();
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

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.content-card,
.comment-card {
  border-radius: 16px;
}

.note-content {
  line-height: 1.8;
  color: #475467;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-header h3 {
  margin-bottom: 4px;
}

.comment-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comment-btn {
  align-self: flex-end;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header-line {
  display: flex;
  justify-content: space-between;
  color: #94a3b8;
  font-size: 13px;
}

.comment-actions {
  margin-top: 8px;
}

.reply-list {
  margin-top: 12px;
  padding-left: 16px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  padding: 8px 0;
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
  .hero img {
    height: 220px;
  }
}
</style>
