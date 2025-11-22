import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('travel_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || '请求失败';
        console.error('API Error:', message);
        return Promise.reject(error);
    }
);

export default apiClient;

