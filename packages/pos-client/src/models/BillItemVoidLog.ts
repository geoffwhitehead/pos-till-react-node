import { field, immutableRelation, relation } from '@nozbe/watermelondb/decorators';
import { BillItem, Printer } from '.';
import { Relation, tableSchema, Model } from '@nozbe/watermelondb';

export type BillItemPrintLogStatus = 'error' | 'success';

export class BillItemVoidLog extends Model {
  static table = 'bill_item_void_logs';

  @field('bill_item_id') billItemId: string;
  @field('voided_at') voidedAt: Date;

  @immutableRelation('bill_items', 'bill_item_id') billItem: Relation<BillItem>;
}

export const billItemVoidLogSchema = tableSchema({
  name: 'bill_item_void_logs',
  columns: [
    { name: 'bill_item_id', type: 'string', isIndexed: true },
    { name: 'voided_at', type: 'number' },
  ],
});
