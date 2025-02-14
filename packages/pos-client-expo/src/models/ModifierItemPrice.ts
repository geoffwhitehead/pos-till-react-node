import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { ModifierItem } from './ModifierItem';
import { PriceGroup } from './PriceGroup';
import { ASSOCIATION_TYPES } from './constants';

export class ModifierItemPrice extends Model {
  static table = 'modifier_item_prices';

  static associations = {
    modifier_items: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'modifier_item_id' },
    price_groups: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'price_group_id' },
  };

  @field('price') price?: number;
  @field('price_group_id') priceGroupId!: string;
  @field('modifier_item_id') modifierItemId!: string;

  @relation('price_groups', 'price_group_id') priceGroup!: Relation<PriceGroup>;
  @relation('modifier_items', 'modifier_item_id') modifierItem!: Relation<ModifierItem>;
}

export const modifierItemPriceSchema = tableSchema({
  name: 'modifier_item_prices',
  columns: [
    { name: 'price', type: 'number', isOptional: true }, // null field indicates this item is not available in this price group
    { name: 'price_group_id', type: 'string' },
    { name: 'modifier_item_id', type: 'string', isIndexed: true },
  ],
});
