import { Model, tableSchema } from '@nozbe/watermelondb';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemPrinterModel extends Model {
  static table = 'item_printers';

  @field('item_id') itemId;
  @field('printer_id') printerId;

  @relation('items', 'item_id') item;
  @relation('printers', 'printer_id') printer;

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
