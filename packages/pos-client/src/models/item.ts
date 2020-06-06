import { Model, Q, tableSchema } from '@nozbe/watermelondb';
import { field, relation, children, lazy } from '@nozbe/watermelondb/decorators';

export class ItemModel extends Model {
  static table = 'items';

  @field('name') name;
  @field('category_id') categoryId;

  @relation('categories', 'category_id') category;

  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'item_id' },
    item_modifiers: { type: 'has_many', foreignKey: 'item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
    item_prices: { type: 'has_many', foreignKey: 'item_id' },
  };

  @children('item_prices') prices;

  @lazy printers = this.collections.get('printers').query(Q.on('item_printers', 'item_id', this.id));
  @lazy modifiers = this.collections.get('modifiers').query(Q.on('item_modifiers', 'item_id', this.id));
}

export const itemSchema = tableSchema({
  name: 'items',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'category_id', type: 'string', isIndexed: true },
  ],
});
