import { Api } from './index';

export const getPriceGroups = () => Api.get('/price-group', {});
export interface PriceGroupItemServerProps {
  groupId: string;
  price: string;
}
