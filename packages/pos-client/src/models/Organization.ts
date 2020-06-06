import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class OrganizationModel extends Model {
  static table = 'organizations';

  @field('name') name;
  @field('email') email;
  @field('phone') phone;
  @field('address_line1') addressLine1;
  @field('address_line2') addressLine2;
  @field('address_city') addressCity;
  @field('address_county') addressCounty;
  @field('address_postcode') addressPostcode;
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
