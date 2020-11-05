import { Model, tableSchema, Query, Q } from '@nozbe/watermelondb';
import { field, lazy, action, children } from '@nozbe/watermelondb/decorators';
import { Item, Printer, tableNames } from '.';
import { PrinterGroupPrinter } from './PrinterGroupPrinter';

export class PrinterGroup extends Model {
  static table = 'printer_groups';

  @field('name') name: string;

  static associations = {
    printer_groups_printers: { type: 'has_many', foreignKey: 'printer_group_id' },
    items: { type: 'has_many', foreignKey: 'printer_group_id' },
  };

  @children('printer_groups_printers') printerGroupsPrinters: Query<PrinterGroupPrinter>;
  @children('items') items: Query<Item>;

  @lazy printers = this.collections
    .get('printers')
    .query(Q.on('printer_groups_printers', 'printer_group_id', this.id)) as Query<Printer>;

  @action updateGroup = async ({ name, printers }: { name: string; printers: Printer[] }) => {
    const printerGroupsPrintersCollection = this.database.collections.get<PrinterGroupPrinter>(
      tableNames.printerGroupsPrinters,
    );
    let batched = [];
    const links = await this.printerGroupsPrinters.fetch();

    batched.push(...links.map(l => l.prepareDestroyPermanently()));

    batched.push(
      ...printers.map(printer => {
        return printerGroupsPrintersCollection.prepareCreate(groupLink => {
          groupLink.printer.set(printer);
          groupLink.printerGroup.set(this);
        });
      }),
    );
    batched.push(
      this.prepareUpdate(group => {
        Object.assign(group, { name });
      }),
    );

    await this.database.action(() => this.database.batch(...batched));
  };

  @action remove = async () => {
    const [printerGroupLinks, items] = await Promise.all([this.printerGroupsPrinters.fetch(), this.items.fetch()]);
    const printerGroupPrintersToDelete = printerGroupLinks.map(pGP => pGP.prepareMarkAsDeleted());
    const itemsToUpdate = items.map(item =>
      item.prepareUpdate(itemRecord => {
        itemRecord.printerGroup.set(null);
      }),
    );

    await this.database.action(() => {
      this.database.batch(...printerGroupPrintersToDelete, ...itemsToUpdate, this.prepareMarkAsDeleted());
    });
  };
}

export const printerGroupSchema = tableSchema({
  name: 'printer_groups',
  columns: [{ name: 'name', type: 'string' }],
});
