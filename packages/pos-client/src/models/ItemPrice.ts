import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemPrice extends Model {
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
