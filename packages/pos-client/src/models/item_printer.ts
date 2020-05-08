import { tableSchema } from '@nozbe/watermelondb';

export interface ItemPrinter {
  _id: string;
  name: string;
  type: string;
  address: string;
}

export const PrinterSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: '_id', type: 'string' },
    { name: 'name', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'address', type: 'string' },
  ],
});
