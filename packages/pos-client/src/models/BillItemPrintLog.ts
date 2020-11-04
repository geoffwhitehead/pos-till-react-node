import { date, field, immutableRelation, readonly, relation } from '@nozbe/watermelondb/decorators';
import { Bill, BillItem, Printer } from '.';
import { Relation, tableSchema, Model } from '@nozbe/watermelondb';

export enum PrintStatus {
  errored = 'errored',
  succeeded = 'succeeded',
  pending = 'pending',
  processing = 'processing',
  cancelled = 'cancelled',
}

export enum PrintType {
  std = 'std',
  void = 'void',
}

export class BillItemPrintLog extends Model {
  static table = 'bill_item_print_logs';

  @field('bill_item_id') billItemId: string;
  @field('bill_id') billId: string; // TODO: this can be removed when nested joins are working with watermelon

  @field('printer_id') printerId: string;
  @field('type') type: PrintType;
  @field('status') status: PrintStatus;
  @readonly @date('created_at') createdAt: Date;

  @immutableRelation('bill_items', 'bill_item_id') billItem: Relation<BillItem>;
  @immutableRelation('bills', 'bill_id') bill: Relation<Bill>;
  @immutableRelation('printers', 'printer_id') printer: Relation<Printer>;

  static associations = {
    bill_items: { type: 'belongs_to', key: 'bill_item_id' },
    bills: { type: 'belongs_to', key: 'bill_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };
}

export const billItemPrintLogSchema = tableSchema({
  name: 'bill_item_print_logs',
  columns: [
    { name: 'bill_item_id', type: 'string', isIndexed: true },
    { name: 'bill_id', type: 'string' },
    { name: 'printer_id', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'type', type: 'string' },
  ],
});
