import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemPriceModel extends Model {
  static table = tableNames.itemPrices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('item_id') itemId;

  @relation(tableNames.priceGroups, 'price_group_id') priceGroup;
  @relation(tableNames.items, 'item_id') item;

  static associations = {
    [tableNames.priceGroups]: { type: 'belongs_to', key: 'price_group_id' },
    [tableNames.items]: { type: 'belongs_to', key: 'item_id' },
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
