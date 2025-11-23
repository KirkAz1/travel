import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/auth/LoginView.vue';
import RegisterView from '@/views/auth/RegisterView.vue';
import TravelNoteDetail from '@/views/travel/TravelNoteDetail.vue';
import FavoritesView from '@/views/user/FavoritesView.vue';
import ProfileView from '@/views/user/ProfileView.vue';
import ChangePasswordView from '@/views/user/ChangePasswordView.vue';
import AttractionsPage from '@/views/attraction/AttractionsPage.vue';
import { useAuthStore } from '@/stores/auth';
import TravelNotesView from '@/views/travel/TravelNotesView.vue';
import CreateTravelNoteView from '@/views/travel/CreateTravelNoteView.vue';


const router = createRouter({
  history: createWebHistory(),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/change-password',
      name: 'change-password-direct',
      component: ChangePasswordView,
      meta: { requiresAuth: true, title: '修改密码 - 游迹全国' }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页 - 游迹全国' },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { title: '登录 - 游迹全国' },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { title: '注册 - 游迹全国' },
    },
    {
      path: '/travel-notes/:id',
      name: 'travel-note-detail',
      component: TravelNoteDetail,
      meta: { title: '游记详情 - 游迹全国' },
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView,
      meta: { requiresAuth: true, title: '我的收藏 - 游迹全国' },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, title: '个人中心 - 游迹全国' },
      children: [
        {
          path: 'change-password',
          name: 'change-password',
          component: ChangePasswordView,
          meta: { requiresAuth: true, title: '修改密码 - 游迹全国' }
        }
      ]
    },
    {
      path: '/attractions',
      name: 'attractions',
      component: AttractionsPage,
      meta: { title: '热门景点 - 游迹全国' },
    },
    {
      path: '/attractions/:id',
      name: 'AttractionDetail',
      component: () => import('@/views/attraction/AttractionDetail.vue'),
    },
    {
      path: '/travel-notes',
      name: 'travel-notes',
      component: TravelNotesView,
      meta: { title: '游记列表 - 游迹全国' },
    },
    {
      path: '/travel-notes/create',
      name: 'create-travel-note',
      component: CreateTravelNoteView,
      meta: { requiresAuth: true, title: '发布游记 - 游迹全国' },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  document.title = to.meta.title || '游迹全国';

  // 如果已登录但未拉取用户信息
  if (authStore.state.token && !authStore.state.user && !authStore.state.loadingUser) {
    await authStore.fetchCurrentUser();
  }

  // 需要登录权限的页面
  if (to.meta.requiresAuth && !authStore.state.token) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 登录/注册页已登录则跳回首页
  if ((to.name === 'login' || to.name === 'register') && authStore.state.token) {
    return next({ name: 'home' });
  }

  next();
});

export default router;
