import apiClient from './http';

// 认证相关
export const authApi = {
    register(payload) {
        return apiClient.post('/auth/register', payload);
    },
    login(payload) {
        return apiClient.post('/auth/login', payload);
    },
    me() {
        return apiClient.get('/auth/me');
    },
};

// 景点
export const attractionApi = {
    list(params) {
        return apiClient.get('/attractions', { params });
    },
    get(id) {
        return apiClient.get(`/attractions/${id}`);
    },
    popular(limit = 6) {
        return apiClient.get('/attractions/popular', { params: { limit } });
    },
    favorite(id) {
        return apiClient.post('/favorites', { target_id: id, target_type: 'attraction' });
    },
    unfavorite(id) {
        return apiClient.delete('/favorites', { data: { target_id: id, target_type: 'attraction' } });
    },
    checkFavorite(id) {
        return apiClient.get('/favorites/check', { params: { target_id: id, target_type: 'attraction' } });
    },
};

// 游记
export const travelNoteApi = {
    list(params) {
        return apiClient.get('/travel-notes', { params });
    },
    get(id) {
        return apiClient.get(`/travel-notes/${id}`);
    },
    create(payload) {
        return apiClient.post('/travel-notes', payload);
    },
    update(id, payload) {
        return apiClient.put(`/travel-notes/${id}`, payload);
    },
    remove(id) {
        return apiClient.delete(`/travel-notes/${id}`);
    },
};

// 评论
export const commentApi = {
    list(params) {
        return apiClient.get('/comments', { params });
    },
    create(payload) {
        return apiClient.post('/comments', payload);
    },
    remove(id) {
        return apiClient.delete(`/comments/${id}`);
    },
};

// 收藏
export const favoriteApi = {
    list(params) {
        return apiClient.get('/favorites', { params });
    },
    add(payload) {
        return apiClient.post('/favorites', payload);
    },
    remove(payload) {
        return apiClient.delete('/favorites', { data: payload });
    },
    check(params) {
        return apiClient.get('/favorites/check', { params });
    },
};

// 点赞
export const likeApi = {
    toggle(payload) {
        return apiClient.post('/likes/toggle', payload);
    },
    check(params) {
        return apiClient.get('/likes/check', { params });
    },
};

