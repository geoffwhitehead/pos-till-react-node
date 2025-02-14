import { Model, Relation, tableSchema } from '@nozbe/watermelondb';
import { action, date, field, immutableRelation, nochange, readonly } from '@nozbe/watermelondb/decorators';
import { Bill } from './Bill';

export const billCallLogSchema = tableSchema({
  name: 'bill_call_logs',
  columns: [
    { name: 'bill_id', type: 'string', isIndexed: true },
    { name: 'created_at', type: 'number' },
    { name: 'updated_at', type: 'number' },
    { name: 'print_message', type: 'string', isOptional: true },
  ],
});

export class BillCallLog extends Model {
  static table = 'bill_call_logs';

  @nochange @field('bill_id') billId: string;
  @readonly @date('created_at') createdAt: Date;
  @readonly @date('updated_at') updatedAt: Date;
  @field('print_message') printMessage: string;

  @immutableRelation('bills', 'bill_id') bill: Relation<Bill>;

  static associations = {
    bills: { type: 'belongs_to', key: 'bill_id' },
    bill_call_print_logs: { type: 'has_many', foreignKey: 'bill_call_log_id' },
  };

  @action void = async () => await this.destroyPermanently();
}
