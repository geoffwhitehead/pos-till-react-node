import { api } from './index';

export const getDiscounts = () => api.get('/product/discounts', {});
