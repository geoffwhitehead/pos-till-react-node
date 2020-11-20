import dayjs, { Dayjs } from 'dayjs';
import { capitalize, flatten, groupBy, keyBy } from 'lodash';
import {
  Bill,
  BillCallPrintLog,
  BillItem,
  BillItemModifierItem,
  BillItemPrintLog,
  PriceGroup,
  Printer,
} from '../../models';
import { PrintType } from '../../models/BillItemPrintLog';
import { alignCenter, alignLeftRightSingle, starDivider } from './helpers';

const MOD_PREFIX = '- ';
const REF_NAME = 'Table';

export const kitchenCall = async (p: {
  bill: Bill;
  billCallPrintLogs: BillCallPrintLog[];
  printers: Printer[];
}): Promise<{ billCallPrintLog: BillCallPrintLog; printer: Printer; commands: any[] }[]> => {
  const { bill, printers, billCallPrintLogs } = p;

  const printersToPrintTo = printers.filter(printer => printer.receivesBillCalls);
  const keyedPrinters = keyBy(printersToPrintTo, printer => printer.id);

  const billCallCommands = billCallPrintLogs.map(log =>
    generateBillCallCommands({
      printer: keyedPrinters[log.printerId],
      reference: bill.reference,
      billCallPrintLog: log,
    }),
  );

  return billCallCommands;
};

export const kitchenReceipt = async (p: {
  billItems: BillItem[];
  billItemPrintLogs: BillItemPrintLog[];
  printers: Printer[];
  priceGroups: PriceGroup[];
  reference: string;
  prepTime: Dayjs;
}): Promise<{ billItemPrintLogs: BillItemPrintLog[]; printer: Printer; commands: any[] }[]> => {
  const { billItems, printers, priceGroups, reference, prepTime, billItemPrintLogs } = p;

  const populatedItems = await Promise.all(
    billItems.map(async billItem => {
      const mods = await billItem.billItemModifierItems.fetch();
      return {
        billItem,
        mods,
      };
    }),
  );

  const combinedFields = billItemPrintLogs.map(billItemPrintLog => {
    const fields = populatedItems.find(item => item.billItem.id === billItemPrintLog.billItemId);

    return {
      billItemPrintLog,
      ...fields,
    };
  });

  const groupedByPriceGroup = groupBy(combinedFields, fields => fields.billItem.priceGroupId);
  const keyedPrinters = keyBy(printers, printer => printer.id);

  const nestedGroupedByPrinterId = Object.values(groupedByPriceGroup).map(groups =>
    groupBy(groups, group => group.billItemPrintLog.printerId),
  );

  const keyedPriceGroups = keyBy(priceGroups, pG => pG.id);

  const printCommands = nestedGroupedByPrinterId.map(group => {
    return Object.entries(group).map(([printerId, itemsToPrint]) => {
      // these records are all grouped by price group so its fine to use the first
      const priceGroupId = itemsToPrint[0].billItem.priceGroupId;
      return {
        priceGroup: keyedPriceGroups[priceGroupId],
        itemsToPrint,
        prepTime,
        reference,
        printer: keyedPrinters[printerId],
      };
    });
  });

  const flattenedPrintCommands = flatten(printCommands);

  const billPrintCommands = flattenedPrintCommands.map(generateBillItemCommands);

  return billPrintCommands;

  // const recieptGroupings = flatten(
  //   printers.map(printer => {
  //     // filter by items that are allocated to this printer
  //     const filteredItemsByPrinter = populatedItems.filter(bI => bI.printers.includes(printer));

  //     // split the item based on price group. A seperate receipt will be sent per price group
  //     const groupedByPriceGroup = priceGroups.map(priceGroup => {
  //       return {
  //         printer,
  //         priceGroup,
  //         itemsToPrint: filteredItemsByPrinter.filter(itemGroup => itemGroup.billItem.priceGroupId === priceGroup.id),
  //       };
  //     });

  //     // filter out any printer groups that dont have any allocated items
  //     const filteredGroups = groupedByPriceGroup.filter(group => group.itemsToPrint.length);

  //     return filteredGroups;
  //   }),
  // );

  // generate an array of all the receipts that will need to be sent out
  // const printCommands = recieptGroupings.map(grp =>
  //   generatePrintCommands({
  //     ...grp,
  //     itemsToPrint: grp.itemsToPrint.map(grp => omit(grp, 'printers')), // disard printers and use from grouping
  //     prepTime,
  //     reference,
  //   }),
  // );

  // return printCommands;
};

const generateBillCallCommands = (p: { printer: Printer; reference: number; billCallPrintLog: BillCallPrintLog }) => {
  const { printer, reference, billCallPrintLog } = p;

  let c = [];

  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format('HH:mm'), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('CALL: ' + reference, printer.printWidth) });

  return {
    commands: c,
    printer,
    billCallPrintLog,
  };
};

const generateBillItemCommands = (p: {
  itemsToPrint: { billItem: BillItem; mods: BillItemModifierItem[]; billItemPrintLog: BillItemPrintLog }[];
  priceGroup: PriceGroup;
  printer: Printer;
  prepTime: Dayjs;
  reference: string;
}) => {
  const { itemsToPrint, priceGroup, printer, prepTime, reference } = p;

  let c = [];

  const pGName = priceGroup.shortName || priceGroup.name;
  c.push({ appendBitmapText: alignCenter(pGName.toUpperCase(), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format('HH:mm'), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('PREP: ' + prepTime.format('HH:mm'), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter(REF_NAME.toUpperCase() + ': ' + reference, printer.printWidth) });
  c.push(starDivider(printer.printWidth));

  const groupedIntoQuantities = Object.values(
    groupBy(itemsToPrint, ({ billItem, mods, billItemPrintLog }) => {
      const isVoid = billItemPrintLog.type === PrintType.void;
      /**
       * the below string is used to uniquely distinguish items based on the item id, modifier ids, and
       * whether its a void or not. This is done so items can be grouped by quanity on the receipts.
       */

      const uniqueString = [billItem.itemId, ...mods.map(m => m.modifierItemId), isVoid].toString();

      return uniqueString;
    }),
  );

  const quantifiedItems = groupedIntoQuantities.map(group => ({
    quantity: group.length,
    isVoided: group[0].billItemPrintLog.type === PrintType.void,
    billItem: group[0].billItem,
    mods: group[0].mods,
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
    billItemPrintLogs: itemsToPrint.map(({ billItemPrintLog }) => billItemPrintLog),
    printer,
    commands: c,
  };
};
