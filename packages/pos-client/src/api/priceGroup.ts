import { api } from './index';

export const getPriceGroups = () => api.get('/product/price-groups', {});
export interface PriceGroupItemServerProps {
  groupId: string;
  price: string;
}
