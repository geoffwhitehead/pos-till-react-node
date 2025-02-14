import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, nochange } from '@nozbe/watermelondb/decorators';

export class Discount extends Model {
  static table = 'discounts';

  @nochange @field('name') name: string;
  @nochange @field('amount') amount: number;
  @nochange @field('is_percent') isPercent: boolean;
}

export const discountSchema = tableSchema({
  name: 'discounts',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'amount', type: 'number' },
    { name: 'is_percent', type: 'boolean' },
  ],
});
