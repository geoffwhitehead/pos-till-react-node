import dayjs, { Dayjs } from 'dayjs';
import { BillItem, PriceGroup, Printer, BillItemModifierItem } from '../../models';
import { groupBy, flatten, omit, capitalize } from 'lodash';
import { alignCenter, starDivider, alignLeftRightSingle } from './helpers';

const MOD_PREFIX = '- ';
const REF_NAME = 'Table';

export const kitchenReceipt = async (p: {
  billItems: BillItem[];
  printers: Printer[];
  priceGroups: PriceGroup[];
  reference: string;
  prepTime: Dayjs;
}): Promise<{ billItems: BillItem[]; printer: Printer; commands: any[] }[]> => {
  const { billItems, printers, priceGroups, reference, prepTime } = p;

  // TODO: fix
  const populatedItems = await Promise.all(
    billItems.map(async billItem => {
      const [mods, printers] = await Promise.all([
        await billItem.modifierItemsIncVoids.fetch(),
        await new Promise(async (res, rej) => {
          const item = await billItem.item.fetch();
          const printers = await item.printers.fetch();
          res(printers);
        }),
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
      itemsToPrint: grp.itemsToPrint.map(grp => omit(grp, 'printers')), // disard printers and use from grouping
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

  const pGName = priceGroup.shortName || priceGroup.name;
  c.push({ appendBitmapText: alignCenter(pGName.toUpperCase(), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format('HH:mm'), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('PREP: ' + prepTime.format('HH:mm'), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter(REF_NAME.toUpperCase() + ': ' + reference, printer.printWidth) });
  c.push(starDivider(printer.printWidth));

  const grouped = Object.values(
    groupBy(itemsToPrint, ({ billItem, mods }) => {
      // construct a unique string for this particular combination of item and modifiers
      return [billItem.itemId, ...mods.map(m => m.modifierItemId), billItem.isVoided].toString();
    }),
  );

  const quantifiedItems = grouped.map(grp => ({
    quantity: grp.length,
    isVoided: grp[0].billItem.isVoided,
    billItem: grp[0].billItem,
    mods: grp[0].mods,
  }));

  quantifiedItems.map(({ quantity, billItem, mods, isVoided }) => {
    if (isVoided) {
      c.push({
        appendBitmapText: alignLeftRightSingle(
          `${('VOID ' + capitalize(billItem.itemShortName)).slice(0, printer.printWidth)}`,
          quantity.toString(),
          printer.printWidth,
        ),
      });
    } else {
      c.push({
        appendBitmapText: alignLeftRightSingle(`${billItem.itemShortName}`, quantity.toString(), printer.printWidth),
      });
    }
    mods.map(mod => {
      c.push({ appendBitmapText: MOD_PREFIX + capitalize(mod.modifierItemShortName) });
    });
  });

  return {
    billItems: itemsToPrint.map(({ billItem }) => billItem),
    printer,
    commands: c,
  };
};
