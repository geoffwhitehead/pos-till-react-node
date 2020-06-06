import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { nochange, field } from '@nozbe/watermelondb/decorators';

export class PaymentType extends Model {
  static table = tableNames.paymentTypes;

  @nochange @field('name') name;

  static associations = {
    [tableNames.billPayments]: { type: 'has_many', foreignKey: 'payment_type_id' },
  };
}
