import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';

export class OrganizationModel extends Model {
  static table = tableNames.organizations;

  @field('name') string;
  @field('email') string;
  @field('phone') string;
  @field('address_line1') string;
  @field('address_line2') string;
  @field('address_city') string;
  @field('address_county') string;
  @field('address_postcode') string;
}

export const organizationSchema = tableSchema({
  name: 'organizations',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'phone', type: 'string' },
    { name: 'address_line1', type: 'string' },
    { name: 'address_line2', type: 'string' },
    { name: 'address_city', type: 'string' },
    { name: 'address_county', type: 'string' },
    { name: 'address_postcode', type: 'string' },
  ],
});
