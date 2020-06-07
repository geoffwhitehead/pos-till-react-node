import { Model, tableSchema, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { PriceGroup } from './PriceGroup';
import { Item } from './Item';

export class ItemPrice extends Model {
  static table = 'item_prices';

  @field('price') price: number;
  @field('price_group_id') priceGroupId: string;
  @field('item_id') itemId: string;

  @relation('price_groups', 'price_group_id') priceGroup: Relation<PriceGroup>;
  @relation('items', 'item_id') item: Relation<Item>;

  static associations = {
    price_groups: { type: 'belongs_to', key: 'price_group_id' },
    items: { type: 'belongs_to', key: 'item_id' },
  };
}

export const itemPriceSchema = tableSchema({
  name: 'item_prices',
  columns: [
    { name: 'price', type: 'number' },
    { name: 'price_group_id', type: 'string' },
    { name: 'item_id', type: 'string', isIndexed: true },
  ],
});
