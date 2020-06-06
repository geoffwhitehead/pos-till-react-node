import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ModifierPriceModel extends Model {
  static table = 'modifier_prices';

  @field('price') price;
  @field('price_group_id') priceGroupId;
  @field('modifier_item_id') modifierItemId;

  @relation('price_groups', 'price_group_id') priceGroup;
  @relation('modifier_items', 'modifier_item_id') modifierItem;
}

export const modifierPriceSchema = tableSchema({
  name: 'modifier_prices',
  columns: [
    { name: 'price', type: 'number' },
    { name: 'price_group_id', type: 'string' },
    { name: 'modifier_item_id', type: 'string', isIndexed: true },
  ],
});
