import { Model, tableSchema, Relation } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';
import { Item } from './Item';
import { Printer } from './Printer';

export class ItemPrinter extends Model {
  static table = 'item_printers';

  @field('item_id') itemId: string;
  @field('printer_id') printerId: string;

  @relation('items', 'item_id') item: Relation<Item>;
  @relation('printers', 'printer_id') printer: Relation<Printer>;

  static associations = {
    items: { type: 'belongs_to', key: 'item_id' },
    printers: { type: 'belongs_to', key: 'printer_id' },
  };
}

export const itemPrinterSchema = tableSchema({
  name: 'item_printers',
  columns: [
    { name: 'item_id', type: 'string', isIndexed: true },
    { name: 'printer_id', type: 'string' },
  ],
});
