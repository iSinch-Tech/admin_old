import api from './apiHelper';

export const getCategories = () => api.get('/categories');

export const getCategorie = (id) => api.get(`/categories/${id}`);