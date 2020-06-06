import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemModifierModel extends Model {
  static table = 'item_modifiers';

  @field('item_id') itemId;
  @field('modifier_id') modifierId;

  @relation('items', 'item_id') item;
  @relation('modifiers', 'modifier_id') modifier;

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
