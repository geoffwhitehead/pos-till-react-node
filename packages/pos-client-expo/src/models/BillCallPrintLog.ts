import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { action, date, field, immutableRelation, nochange, readonly } from '@nozbe/watermelondb/decorators';
import { BillCallLog, Printer } from '.';
import { PrintStatus } from './BillItemPrintLog';

export const billCallPrintLogSchema = tableSchema({
  name: 'bill_call_print_logs',
  columns: [
    { name: 'bill_call_log_id', type: 'string', isIndexed: true },
    { name: 'printer_id', type: 'string' },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'status', type: 'string' },
  ],
});

export class BillCallPrintLog extends Model {
  static table = 'bill_call_print_logs';

  @nochange @field('bill_call_log_id') billCallLogId: string;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
  @field('printer_id') printerId: string;
  @field('status') status: PrintStatus;

  @immutableRelation('bill_call_logs', 'bill_call_log_id') billCallLog: Relation<BillCallLog>;
  @immutableRelation('printers', 'printer_id') printer: Relation<Printer>;

  static associations = {
    bill_call_logs: { type: 'belongs_to', key: 'bill_call_log_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };

  @action void = async () => await this.destroyPermanently();
}
