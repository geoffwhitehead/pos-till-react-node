import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';
import { Modifier } from './Modifier';
import { ASSOCIATION_TYPES } from './constants';

export class ItemModifier extends Model {
  static table = 'item_modifiers';

  @field('item_id') itemId!: string;
  @field('modifier_id') modifierId!: string;

  @relation('items', 'item_id') item!: Relation<Item>;
  @relation('modifiers', 'modifier_id') modifier!: Relation<Modifier>;

  static associations = {
    items: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'item_id' },
    modifiers: { type: ASSOCIATION_TYPES.BELONGS_TO, key: 'modifier_id' },
  };
}

export const itemModifierSchema = tableSchema({
  name: 'item_modifiers',
  columns: [
    { name: 'item_id', type: 'string' },
    { name: 'modifier_id', type: 'string' },
  ],
});
