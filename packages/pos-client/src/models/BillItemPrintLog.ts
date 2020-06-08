import { field, relation } from '@nozbe/watermelondb/decorators';
import { BillItem, Printer } from '.';
import { Relation, tableSchema, Model } from '@nozbe/watermelondb';

export type BillItemPrintLogStatus = 'error' | 'success';

export class BillItemPrintLog extends Model {
  static table = 'bill_item_print_logs';

  @field('bill_item_id') billItemId: string;
  @field('printer_id') printerId: string;
  @field('status') status: BillItemPrintLogStatus;

  @relation('bill_items', 'bill_item_id') billItem: Relation<BillItem>;
  @relation('printers', 'printer_id') printer: Relation<Printer>;

  static associations = {
    bill_items: { type: 'belongs_to', key: 'bill_item_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };
}

export const billItemPrintLogSchema = tableSchema({
  name: 'bill_item_print_logs',
  columns: [
    { name: 'bill_item_id', type: 'string', isIndexed: true },
    { name: 'printer_id', type: 'string' },
    { name: 'status', type: 'string' },
  ],
});
