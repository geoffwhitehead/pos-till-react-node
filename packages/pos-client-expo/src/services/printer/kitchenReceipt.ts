import dayjs, { Dayjs } from 'dayjs';
import { capitalize, Dictionary, flatten, groupBy, keyBy, sortBy } from 'lodash';
import {
  Bill,
  BillCallPrintLog,
  BillItem,
  BillItemModifierItem,
  BillItemPrintLog,
  Category,
  PriceGroup,
  PrintCategory,
  Printer,
} from '../../models';
import { PrintType } from '../../models/BillItemPrintLog';
import { PrintItemGroupingEnum } from '../../models/Organization';
import { alignCenter, alignLeftRightSingle, starDivider, subHeader } from './helpers';

const MOD_PREFIX = '- ';
const REF_NAME = 'Table';

const timeFormat = 'h:mm a';

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
  prepTime?: Dayjs;
  categories: Category[];
  printCategories: PrintCategory[];
  printItemGrouping: PrintItemGroupingEnum;
}): Promise<{ billItemPrintLogs: BillItemPrintLog[]; printer: Printer; commands: any[] }[]> => {
  const {
    billItems,
    printers,
    priceGroups,
    reference,
    prepTime,
    billItemPrintLogs,
    categories,
    printCategories,
    printItemGrouping,
  } = p;

  const keyedCategories = keyBy(categories, category => category.id);
  const keyedPrintCategories = keyBy(printCategories, printCategory => printCategory.id);

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
        keyedCategories,
        keyedPrintCategories,
      };
    });
  });

  const flattenedPrintCommands = flatten(printCommands);

  const billPrintCommands = flattenedPrintCommands.map(generateBillItemCommands);

  return billPrintCommands;
};

const generateBillCallCommands = (p: { printer: Printer; reference: number; billCallPrintLog: BillCallPrintLog }) => {
  const { printer, reference, billCallPrintLog } = p;

  let c = [];

  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format(timeFormat), printer.printWidth) });
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
  prepTime?: Dayjs;
  reference: string;
  keyedCategories: Dictionary<Category>;
  keyedPrintCategories: Dictionary<PrintCategory>;
}) => {
  const { itemsToPrint, priceGroup, printer, prepTime, reference, keyedCategories, keyedPrintCategories } = p;

  let c = [];

  const pGName = priceGroup.shortName || priceGroup.name;
  c.push({ appendBitmapText: alignCenter(pGName.toUpperCase(), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter('IN: ' + dayjs().format(timeFormat), printer.printWidth) });
  prepTime && c.push({ appendBitmapText: alignCenter('PREP: ' + prepTime.format(timeFormat), printer.printWidth) });
  c.push({ appendBitmapText: alignCenter(REF_NAME.toUpperCase() + ': ' + reference, printer.printWidth) });
  c.push(starDivider(printer.printWidth));

  const groupedIntoQuantities = Object.values(
    groupBy(itemsToPrint, ({ billItem, mods, billItemPrintLog }) => {
      const isVoid = billItemPrintLog.type === PrintType.void;
      const itemId = billItem.itemId;
      const modifierIds = mods.map(m => m.modifierItemId).toString();
      const msg = billItem.printMessage;
      /**
       * the below string is used to uniquely distinguish items based on the item id, modifier ids, print message, and
       * whether its a void or not. This is done so items can be grouped by quanity correctly on the receipts. An item
       * with a print message will more often than not - not be able to be grouped
       */
      const uniqueString = `${itemId}-${modifierIds}-${msg}-${isVoid}`;

      return uniqueString;
    }),
  );

  const quantifiedItems = groupedIntoQuantities.map(group => ({
    quantity: group.length,
    isVoided: group[0].billItemPrintLog.type === PrintType.void,
    billItem: group[0].billItem,
    mods: group[0].mods,
    printMessage: group[0].billItem.printMessage,
  }));

  const groupedByCategory = groupBy(quantifiedItems, group => {
    const category = keyedCategories[group.billItem.categoryId];
    // Note: if the user has provided a print category to group by use this.
    return category.printCategoryId || category.id;
  });

  sortBy(Object.entries(groupedByCategory), ([categoryId, quantifiedItems]) => {
    const category = keyedCategories[categoryId];
    const printCategory = keyedPrintCategories[categoryId];

    return printCategory.displayOrder || category.shortName || 0;
  }).map(([categoryId, quantifiedItems]) => {
    const printCategory = keyedPrintCategories[categoryId]?.shortName;
    const category = keyedCategories[categoryId]?.shortName;

    // Note: use the print category if defined otherwise default to standard category id
    const categoryShortName = printCategory || category;

    c.push({ appendBitmapText: subHeader(categoryShortName?.toUpperCase() || 'OTHER', printer.printWidth) });

    quantifiedItems.map(({ quantity, billItem, mods, isVoided, printMessage }) => {
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
      printMessage &&
        c.push({
          appendBitmapText: printMessage,
        });
    });
  });

  return {
    billItemPrintLogs: itemsToPrint.map(({ billItemPrintLog }) => billItemPrintLog),
    printer,
    commands: c,
  };
};
