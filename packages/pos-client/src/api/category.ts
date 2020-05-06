import { api } from './index';

export const getCategories = () => api.get('/product/categories', {});
