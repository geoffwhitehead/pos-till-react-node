import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, relation, children } from '@nozbe/watermelondb/decorators';

export class ModifierItem extends Model {
  static table = 'modifier_items';

  @field('name') name;
  @field('modifier_id') modifierId;

  @relation('modifiers', 'modifier_id') modifier;

  @children('modifier_prices') prices;

  static associations = {
    modifier_prices: { type: 'has_many', foreignKey: 'modifier_item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
  };
}

export const modifierItemSchema = tableSchema({
  name: 'modifier_items',
  columns: [
    { name: 'modifier_id', type: 'string', isIndexed: true },
    { name: 'name', type: 'string' },
  ],
});
