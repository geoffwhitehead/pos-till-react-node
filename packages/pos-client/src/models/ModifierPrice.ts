import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { ModifierItem } from './ModifierItem';
import { PriceGroup } from './PriceGroup';

export class ModifierPrice extends Model {
  static table = 'modifier_prices';

  @field('price') price: number;
  @field('price_group_id') priceGroupId: string;
  @field('modifier_item_id') modifierItemId: string;

  @relation('price_groups', 'price_group_id') priceGroup: Relation<PriceGroup>;
  @relation('modifier_items', 'modifier_item_id') modifierItem: Relation<ModifierItem>;
}

export const modifierPriceSchema = tableSchema({
  name: 'modifier_prices',
  columns: [
    { name: 'price', type: 'number', isOptional: true }, // null field prevents selection for this price group
    { name: 'price_group_id', type: 'string' },
    { name: 'modifier_item_id', type: 'string', isIndexed: true },
  ],
});
