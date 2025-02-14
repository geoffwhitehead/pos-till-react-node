import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, nochange } from '@nozbe/watermelondb/decorators';
import { ASSOCIATION_TYPES } from './constants';

export class PaymentType extends Model {
  static table = 'payment_types';

  @nochange @field('name') name!: string;

  static associations = {
    bill_payments: { type: ASSOCIATION_TYPES.HAS_MANY, foreignKey: 'payment_type_id' },
  };
}

export const paymentTypeSchema = tableSchema({
  name: 'payment_types',
  columns: [{ name: 'name', type: 'string' }],
});
