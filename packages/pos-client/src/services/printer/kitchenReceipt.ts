import dayjs, { Dayjs } from 'dayjs';
import { BillItem, PriceGroup, Printer, BillItemModifierItem } from '../../models';
import { groupBy, flatten, omit } from 'lodash';
import { alignCenter, starDivider, alignLeftRight } from './printer';

const modPrefix = ' -'; // TODO: move to settings
const referenceName = 'Table';

export const kitchenReceipt = async (p: {
  billItems: BillItem[];
  printers: Printer[];
  priceGroups: PriceGroup[];
  reference: string;
  prepTime: Dayjs;
}): Promise<{ billItems: BillItem[]; printer: Printer; commands: any[] }[]> => {
  const { billItems, printers, priceGroups, reference, prepTime } = p;

  const populatedItems = await Promise.all(
    billItems.map(async billItem => {
      const [mods, printers] = await Promise.all([
        await billItem.billItemModifierItems.fetch(),
        await billItem.printers.fetch(),
      ]);
      return {
        billItem,
        printers,
        mods,
      };
    }),
  );

  const recieptGroupings = flatten(
    printers.map(printer => {
      // filter by items that are allocated to this printer
      const filteredItemsByPrinter = populatedItems.filter(bI => bI.printers.includes(printer));

      // split the item based on price group. A seperate receipt will be sent per price group
      const groupedByPriceGroup = priceGroups.map(priceGroup => {
        return {
          printer,
          priceGroup,
          itemsToPrint: filteredItemsByPrinter.filter(itemGroup => itemGroup.billItem.priceGroupId === priceGroup.id),
        };
      });

      // filter out any printer groups that dont have any allocated items
      const filteredGroups = groupedByPriceGroup.filter(group => group.itemsToPrint.length);

      return filteredGroups;
    }),
  );

  // generate an array of all the receipts that will need to be sent out
  const printCommands = recieptGroupings.map(grp =>
    generatePrintCommands({
      ...grp,
      itemsToPrint: grp.itemsToPrint.map(grp => omit(grp, 'printers')),
      prepTime,
      reference,
    }),
  );

  return printCommands;
};
const generatePrintCommands = (p: {
  itemsToPrint: { billItem: BillItem; mods: BillItemModifierItem[] }[];
  priceGroup: PriceGroup;
  printer: Printer;
  prepTime: Dayjs;
  reference: string;
}) => {
  const { itemsToPrint, priceGroup, printer, prepTime, reference } = p;

  const c = [];

  c.push(starDivider);
  c.push({ appendBitmapText: alignCenter(priceGroup.name.toUpperCase()) });
  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format('HH:mm')) });
  c.push({ appendBitmapText: alignCenter('PREP: ' + prepTime.format('HH:mm')) });
  c.push({ appendBitmapText: alignCenter(referenceName.toUpperCase() + ': ' + reference) });
  c.push(starDivider);

  const grouped = Object.values(
    groupBy(itemsToPrint, ({ billItem, mods }) => {
      // construct a unique string for this particular combination of item and modifiers
      return [billItem.itemId, ...mods.map(m => m.modifierItemId)].toString();
    }),
  );

  const quantifiedItems = grouped.map(grp => ({
    quantity: grp.length,
    billItem: grp[0].billItem,
    mods: grp[0].mods,
  }));

  quantifiedItems.map(({ quantity, billItem, mods }) => {
    c.push({ appendBitmapText: alignLeftRight(billItem.itemName.toUpperCase(), quantity.toString()) });
    mods.map(mod => {
      c.push({ appendBitmapText: modPrefix + mod.modifierItemName.toUpperCase() });
    });
  });

  return {
    billItems: itemsToPrint.map(({ billItem }) => billItem),
    printer,
    commands: c,
  };
};
