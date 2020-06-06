import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { nochange, field, readonly, date, immutableRelation, action } from '@nozbe/watermelondb/decorators';

export const billPaymentSchema = tableSchema({
    name: 'bill_payments',
    columns: [
      { name: 'payment_type_id', type: 'string' },
      { name: 'bill_id', type: 'string', isIndexed: true },
      { name: 'amount', type: 'number' },
      { name: 'is_change', type: 'boolean' },
      { name: 'created_at', type: 'number' },
      { name: 'updated_at', type: 'number' },
      { name: 'is_voided', type: 'boolean' },
    ],
  });
  
export class BillPaymentModel extends Model {
  static table = tableNames.billPayments;

  @nochange @field('payment_type_id') paymentTypeId;
  @nochange @field('amount') amount;
  @nochange @field('is_change') isChange; // TODO: update to credit / debit

  @readonly @date('created_at') createdAt;
  @readonly @date('updated_at') updatedAt;

  static associations = {
    [tableNames.bills]: { type: 'belongs_to', key: 'bill_id' },
    [tableNames.paymentTypes]: { type: 'belongs_to', key: 'payment_type_id' },
  };

  @immutableRelation(tableNames.paymentTypes, 'payment_type_id') paymentType;
  @immutableRelation(tableNames.bills, 'bill_id') bill;

  @action close = async () => await this.destroyPermanently();
}
