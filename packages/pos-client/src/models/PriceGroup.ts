import { Model } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field } from '@nozbe/watermelondb/decorators';

export class PriceGroup extends Model {
  static table = tableNames.priceGroups;

  @field('name') name;
}
