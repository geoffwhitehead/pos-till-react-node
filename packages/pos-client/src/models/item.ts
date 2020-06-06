import { Model, Q, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation, children, lazy } from '@nozbe/watermelondb/decorators';

export class ItemModel extends Model {
  static table = tableNames.items;

  @field('name') name;
  @field('category_id') categoryId;

  @relation(tableNames.categories, 'category_id') category;

  static associations = {
    [tableNames.itemPrinters]: { type: 'has_many', foreignKey: 'item_id' },
    [tableNames.itemModifiers]: { type: 'has_many', foreignKey: 'item_id' },
    [tableNames.modifiers]: { type: 'belongs_to', key: 'modifier_id' },
    [tableNames.categories]: { type: 'belongs_to', key: 'category_id' },
    [tableNames.itemPrices]: { type: 'has_many', foreignKey: 'item_id' },
  };

  @children(tableNames.itemPrices) prices;

  @lazy printers = this.collections.get(tableNames.printers).query(Q.on(tableNames.itemPrinters, 'item_id', this.id));
  @lazy modifiers = this.collections
    .get(tableNames.modifiers)
    .query(Q.on(tableNames.itemModifiers, 'item_id', this.id));
}

export const itemSchema = tableSchema({
  name: 'items',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'category_id', type: 'string', isIndexed: true },
  ],
});
