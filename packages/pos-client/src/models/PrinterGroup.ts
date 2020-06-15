import { Model, tableSchema, Query, Q } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class PrinterGroup extends Model {
  static table = 'printer_groups';

  @field('name') name: string;

  static associations = {
    printer_groups_printers: { type: 'has_many', foreignKey: 'printer_group_id' },
    items: { type: 'has_many', foreignKey: 'printer_group_id' },
  };
}

export const printerGroupSchema = tableSchema({
  name: 'printer_groups',
  columns: [{ name: 'name', type: 'string' }],
});
