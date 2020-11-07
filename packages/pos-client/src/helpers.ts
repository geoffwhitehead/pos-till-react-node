import { ModifierItemPrice, PriceGroup } from './models';
import { ItemPrice } from './models/ItemPrice';

export const resolvePrice = (priceGroup: PriceGroup, prices: ItemPrice[] | ModifierItemPrice[]): number =>
  prices.find(p => p.priceGroupId === priceGroup.id)?.price;
