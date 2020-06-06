import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ModifierPriceModel extends Model {
  static table = tableNames.modifierPrices;

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_id') modifierItemId;

  @relation(tableNames.priceGroups, 'price_group_id') priceGroup;
  @relation(tableNames.modifierItems, 'modifier_item_id') modifierItem;
}

export const modifierPriceSchema = tableSchema({
  name: 'modifier_prices',
  columns: [
    { name: 'price', type: 'number' },
    { name: 'price_group_id', type: 'string' },
    { name: 'modifier_item_id', type: 'string', isIndexed: true },
  ],
});
