import { reactive, readonly } from 'vue';
import { authApi } from '@/api';

const state = reactive({
  token: localStorage.getItem('travel_token') || '',
  user: JSON.parse(localStorage.getItem('travel_user') || 'null'),
  loadingUser: false,
});

function setAuth(token, user) {
  state.token = token;
  state.user = user;
  localStorage.setItem('travel_token', token);
  localStorage.setItem('travel_user', JSON.stringify(user));
}

function clearAuth() {
  state.token = '';
  state.user = null;
  localStorage.removeItem('travel_token');
  localStorage.removeItem('travel_user');
}

async function fetchCurrentUser() {
  if (!state.token) return;
  try {
    state.loadingUser = true;
    const { data } = await authApi.me();
    if (data?.success) {
      state.user = data.data;
      localStorage.setItem('travel_user', JSON.stringify(data.data));
    }
  } catch (error) {
    console.error('获取用户信息失败', error);
    clearAuth();
  } finally {
    state.loadingUser = false;
  }
}

export function useAuthStore() {
  return {
    state: readonly(state),
    setAuth,
    clearAuth,
    fetchCurrentUser,
  };
}

