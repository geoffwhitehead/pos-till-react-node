import { Model, tableSchema, Query, Q } from '@nozbe/watermelondb';
import { action, children, field } from '@nozbe/watermelondb/decorators';
import { PrinterGroupPrinter } from '.';

export enum Emulations {
  'StarPRNT' = 'StarPRNT',
  'StarLine' = 'StarLine',
  'StarGraphic' = 'StarGraphic',
  'StarDotImpact' = 'StarDotImpact',
  'EscPosMobile' = 'EscPosMobile',
  'EscPos' = 'EscPos',
}

export type PrinterProps = {
  name: string;
  address: string;
  macAddress: string;
  printWidth: number;
  emulation: Emulations;
};

export class Printer extends Model {
  static table = 'printers';

  @field('name') name: string;
  @field('address') address: string;
  @field('mac_address') macAddress: string;
  @field('print_width') printWidth: number;
  @field('emulation') emulation: Emulations;

  static associations = {
    printer_groups_printers: { type: 'has_many', foreignKey: 'printer_id' },
  };

  @children('printer_groups_printers') printerGroupsPrinters: Query<PrinterGroupPrinter>;

  @action removeWithChildrenSync = async () => {
    await this.database.action(async () => {
      await this.experimentalMarkAsDeleted();
    });
  };
}

export const printerSchema = tableSchema({
  name: 'printers',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'address', type: 'string' },
    { name: 'mac_address', type: 'string' },
    { name: 'print_width', type: 'number' },
    { name: 'emulation', type: 'string' },
  ],
});
