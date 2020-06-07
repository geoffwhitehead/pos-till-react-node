import { Model, tableSchema, Query } from '@nozbe/watermelondb';
import { field, lazy } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';

export class Printer extends Model {
  static table = 'printers';

  @field('name') name: string;
  @field('type') type: string;
  @field('address') address: string;

  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };
  @lazy items = this.collections.get('items').query(Q.on('item_printers', 'printer_id', this.id)) as Query<Item>;
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
  ],
});
