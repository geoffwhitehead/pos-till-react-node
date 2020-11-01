import { ModifierPrice, PriceGroup } from './models';
import { ItemPrice } from './models/ItemPrice';

export const resolvePrice = (priceGroup: PriceGroup, prices: ItemPrice[] | ModifierPrice[]): number =>
  prices.find(p => p.priceGroupId === priceGroup.id)?.price;
