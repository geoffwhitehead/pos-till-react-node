import { Model, Q, tableSchema, Relation, Query } from '@nozbe/watermelondb';
import { field, relation, children, lazy } from '@nozbe/watermelondb/decorators';
import { Category } from './Category';
import { ItemPrice } from './ItemPrice';
import { Printer } from './Printer';
import { Modifier } from './Modifier';
import { PrinterGroup } from '.';

export class Item extends Model {
  static table = 'items';

  @field('name') name: string;
  @field('short_name') shortName: string;
  @field('category_id') categoryId: string;
  @field('printer_group_id') printerGroupId: string;

  @relation('categories', 'category_id') category: Relation<Category>;
  @relation('printer_groups', 'printer_group_id') printerGroup: Relation<PrinterGroup>;

  static associations = {
    item_modifiers: { type: 'has_many', foreignKey: 'item_id' },
    modifiers: { type: 'belongs_to', key: 'modifier_id' },
    categories: { type: 'belongs_to', key: 'category_id' },
    item_prices: { type: 'has_many', foreignKey: 'item_id' },
    printer_groups: { type: 'belongs_to', key: 'printer_group_id'}
  };

  @children('item_prices') prices: Query<ItemPrice>;

  @lazy printers = this.collections.get('printers').query(Q.on('printer_groups_printers', 'printer_group_id', this.printerGroupId)) as Query<Printer>;
  @lazy modifiers = this.collections.get('modifiers').query(Q.on('item_modifiers', 'item_id', this.id)) as Query<
    Modifier
  >;
}

export const itemSchema = tableSchema({
  name: 'items',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'short_name', type: 'string' },
    { name: 'category_id', type: 'string', isIndexed: true },
    { name: 'printer_group_id', type: 'string' },
  ],
});
