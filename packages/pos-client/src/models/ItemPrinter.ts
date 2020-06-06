import { Model, tableSchema } from '@nozbe/watermelondb';
import { tableNames } from '.';
import { field, relation } from '@nozbe/watermelondb/decorators';

export class ItemPrinterModel extends Model {
  static table = tableNames.itemPrinters;

  @field('item_id') itemId;
  @field('printer_id') printerId;

  @relation(tableNames.items, 'item_id') item;
  @relation(tableNames.printers, 'printer_id') printer;

  static associations = {
    [tableNames.items]: { type: 'belongs_to', key: 'item_id' },
    [tableNames.printers]: { type: 'belongs_to', key: 'printer_id' },
  };
}

export const itemPrinterSchema = tableSchema({
  name: 'item_printers',
  columns: [
    { name: 'item_id', type: 'string', isIndexed: true },
    { name: 'printer_id', type: 'string' },
  ],
});
