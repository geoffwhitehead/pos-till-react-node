import { Api } from './index';

export const getPriceGroups = () => Api.get('/product/price-groups', {});
export interface PriceGroupItemServerProps {
  groupId: string;
  price: string;
}
