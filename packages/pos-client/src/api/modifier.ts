import { api } from './index';

export const getModifiers = () => api.get('/product/modifiers', {});
