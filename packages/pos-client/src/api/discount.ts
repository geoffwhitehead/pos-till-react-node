import { Api } from './index';

export const getDiscounts = () => Api.get('/product/discounts', {});
