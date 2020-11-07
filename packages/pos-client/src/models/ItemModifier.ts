import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';
import { Modifier } from './Modifier';

export class ItemModifier extends Model {
  static table = 'item_modifiers';

  @field('item_id') itemId: string;
  @field('modifier_id') modifierId: string;

  @relation('items', 'item_id') item: Relation<Item>;
  @relation('modifiers', 'modifier_id') modifier: Relation<Modifier>;

  static associations = {
    items: { type: 'belongs_to', key: 'item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
  };
}

export const itemModifierSchema = tableSchema({
  name: 'item_modifiers',
  columns: [
    { name: 'item_id', type: 'string' },
    { name: 'modifier_id', type: 'string' },
  ],
});
