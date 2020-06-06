import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { nochange, field } from '@nozbe/watermelondb/decorators';

export class DiscountModel extends Model {
  static table = tableNames.discounts;

  @nochange @field('name') name;
  @nochange @field('amount') amount;
  @nochange @field('is_percent') isPercent;
}

export const discountSchema = tableSchema({
  name: 'discounts',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'amount', type: 'number' },
    { name: 'is_percent', type: 'boolean' },
  ],
});
