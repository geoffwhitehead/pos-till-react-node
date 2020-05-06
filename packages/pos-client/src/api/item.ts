import { api } from './index';

export const getItems = () => api.get('/product/items', {});
