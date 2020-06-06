import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, lazy } from '@nozbe/watermelondb/decorators';

export class PrinterModel extends Model {
  static table = 'printers';

  @field('name') name;
  @field('type') type;
  @field('address') address;

  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore
  @lazy items = this.collections.get('items').query(Q.on('item_printers', 'printer_id', this.id));
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
  ],
});
