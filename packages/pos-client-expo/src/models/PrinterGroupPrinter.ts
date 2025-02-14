import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Printer, PrinterGroup } from '.';

export class PrinterGroupPrinter extends Model {
  static table = 'printer_groups_printers';

  @field('printer_group_id') printerGroupId: string;
  @field('printer_id') printerId: string;

  static associations = {
    printer_groups: { type: 'belongs_to', key: 'printer_group_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };

  @relation('printer_groups', 'printer_group_id') printerGroup: Relation<PrinterGroup>;
  @relation('printers', 'printer_id') printer: Relation<Printer>;
}

export const printerGroupPrinterSchema = tableSchema({
  name: 'printer_groups_printers',
  columns: [
    { name: 'printer_group_id', type: 'string', isIndexed: true },
    { name: 'printer_id', type: 'string' },
  ],
});
