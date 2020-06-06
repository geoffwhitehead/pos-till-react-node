import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';
import { tableNames } from '.';

export class PrinterModel extends Model {
  static table = 'printers';

  @field('name') name;
  @field('type') type;
  @field('address') address;

  static associations = {
    [tableNames.itemPrinters]: { type: 'has_many', foreignKey: 'printer_id' },
  };
  // @ts-ignore
  @lazy items = this.collections.get(tableNames.items).query(Q.on(tableNames.itemPrinters, 'printer_id', this.id));
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
  ],
});
