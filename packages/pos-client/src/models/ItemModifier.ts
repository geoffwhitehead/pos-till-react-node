import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemModifierModel extends Model {
  static table = tableNames.itemModifiers;

  @field('item_id') itemId;
  @field('modifier_id') modifierId;

  @relation(tableNames.items, 'item_id') item;
  @relation(tableNames.modifiers, 'modifier_id') modifier;

  static associations = {
    [tableNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tableNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
  };
}

export const itemModifierSchema = tableSchema({
  name: 'item_modifiers',
  columns: [
    { name: 'item_id', type: 'string' },
    { name: 'modifier_id', type: 'string' },
  ],
});
