import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { nochange, field } from '@nozbe/watermelondb/decorators';

export class PaymentTypeModel extends Model {
  static table = tableNames.paymentTypes;

  @nochange @field('name') name;

  static associations = {
    [tableNames.billPayments]: { type: 'has_many', foreignKey: 'payment_type_id' },
  };
}

export const paymentTypeSchema = tableSchema({
  name: 'payment_types',
  columns: [{ name: 'name', type: 'string' }],
});
