// Favorites APIs
export const favoriteAPI = {
  getUserFavorites: (userId) => api.get(`/favorites/user/${userId}`),
  addFavorite: (userId, novelId) => api.post('/favorites', { userId, novelId }),
  removeFavorite: (userId, novelId) => api.delete(`/favorites/user/${userId}/novel/${novelId}`),
};

// Reading History APIs
export const readingHistoryAPI = {
  getUserHistory: (userId) => api.get(`/reading-history/user/${userId}`),
  updateHistory: (userId, novelId, chapterId) => api.post('/reading-history', { userId, novelId, chapterId }),
};
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
};

// Novel APIs
export const novelAPI = {
  getAll: (params) => api.get('/novels', { params }),
  getById: (id, params) => api.get(`/novels/${id}`, { params }),
  create: (data) => api.post('/novels', data),
  update: (id, data) => api.put(`/novels/${id}`, data),
  delete: (id) => api.delete(`/novels/${id}`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Chapter APIs
export const chapterAPI = {
  getAll: (params) => api.get('/chapters', { params }),
  getById: (id) => api.get(`/chapters/${id}`),
  create: (data) => api.post('/chapters', data),
  update: (id, data) => api.put(`/chapters/${id}`, data),
  delete: (id) => api.delete(`/chapters/${id}`),
};

// Comment APIs
export const commentAPI = {
  getAll: (params) => api.get('/comments', { params }),
  getById: (id) => api.get(`/comments/${id}`),
  create: (data) => api.post('/comments', data),
  update: (id, data) => api.put(`/comments/${id}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
};

// Report APIs
export const reportAPI = {
  getPopularNovels: () => api.get('/reports/public/popular-novels'),
  getAuthorViews: () => api.get('/reports/author/my-views'),
  getAuthorComments: () => api.get('/reports/author/comments'),
  // Admin reports
  getTotalUsers: () => api.get('/reports/admin/total-users'),
  getDailyUsers: () => api.get('/reports/admin/daily-users'),
  getMonthlyUsers: () => api.get('/reports/admin/monthly-users'),
  getYearlyUsers: () => api.get('/reports/admin/yearly-users'),
  getViewsByCategory: () => api.get('/reports/admin/views-by-category'),
  getViewsByAuthor: () => api.get('/reports/admin/views-by-author'),
  getSystemStats: () => api.get('/reports/admin/system-stats'),
  getDailyUsage: () => api.get('/reports/admin/daily-usage'),
  getMonthlyUsage: () => api.get('/reports/admin/monthly-usage'),
  getYearlyUsage: () => api.get('/reports/admin/yearly-usage'),
};

export default api;
