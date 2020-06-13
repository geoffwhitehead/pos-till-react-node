import { Model, tableSchema, Query, Q } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Printer extends Model {
  static table = 'printers';

  @field('name') name: string;
  @field('type') type: 'wifi' | 'ethernet';
  @field('address') address: string;
  @field('macAddress') macAddress: string;
  @field('print_width') printWidth: number;
  @field('emulation') emulation: 'StarPRNT' | 'StarLine' | 'StarGraphic' | 'StarDotImpact' | 'EscPosMobile' | 'EscPos';

  static associations = {
    item_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'macAddress', type: 'string' },
    { name: 'print_width', type: 'number' },
    { name: 'emulation', type: 'string' },
  ],
});
