import { Model, tableSchema, Query } from '@nozbe/watermelondb';
import { field, lazy } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';

export class Printer extends Model {
  static table = 'printers';

  @field('name') name: string;
  @field('type') type: 'wifi' | 'ethernet';
  @field('address') address: string;
  @field('print_width') printWidth: number;
  @field('emulation') emulation: 'StarPRNT' | 'StarLine' | 'StarGraphic' | 'StarDotImpact' | 'EscPosMobile' | 'EscPos';

  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };
  @lazy items = this.collections.get('items').query(Q.on('item_printers', 'printer_id', this.id)) as Query<Item>;
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'print_width', type: 'string' },
    { name: 'emulation', type: 'string' },
  ],
});
