import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, children } from '@nozbe/watermelondb/decorators';

export class Modifier extends Model {
  static table = 'modifiers';

  @field('name') name;
  @field('min_items') minItems;
  @field('max_items') maxItems;

  static associations = {
    item_modifiers: { type: 'has_many', foreignKey: 'modifier_id' },
    modifier_items: { type: 'has_many', foreignKey: 'modifier_id' },
    items: { type: 'belongs_to', foreignKey: 'modifier_id' },
  };

  @children('modifier_items') modifierItems;
}

export const modifierSchema = tableSchema({
  name: 'modifiers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'min_items', type: 'number' },
    { name: 'max_items', type: 'number' },
  ],
});
