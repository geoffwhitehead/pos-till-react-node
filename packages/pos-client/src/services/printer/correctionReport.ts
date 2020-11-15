import { Database } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { capitalize, groupBy, sumBy } from 'lodash';
import { Bill, BillItem, BillPeriod, Organization, Printer } from '../../models';
import { formatNumber } from '../../utils';
import { addHeader, alignCenter, alignLeftRight, starDivider } from './helpers';
import { receiptTempate } from './template';

type CorrectionReportProps = {
  database: Database;
  billPeriod: BillPeriod;
  printer: Printer;
  organization: Organization;
};
const modPrefix = ' -';

export const correctionReport = async ({
  billPeriod,
  database,
  printer,
  organization,
}: CorrectionReportProps): Promise<string[]> => {
  const { currency } = organization;

  let commands = [];

  const [periodItemVoids, bills] = await Promise.all([
    billPeriod.periodItemVoidsAndCancels.fetch(),
    billPeriod.bills.fetch(),
  ]);

  const voids = periodItemVoids.filter(item => dayjs(item.voidedAt).isAfter(item.storedAt));
  const cancels = periodItemVoids.filter(item => dayjs(item.voidedAt).isBefore(item.storedAt));

  commands.push(starDivider(printer.printWidth));
  commands.push({
    appendBitmapText: alignCenter('-- CORRECTION REPORT --', printer.printWidth),
  });

  commands.push({
    appendBitmapText: alignLeftRight(
      `Opened: `,
      dayjs(billPeriod.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(printer.printWidth / 2),
    ),
  });

  commands.push({
    appendBitmapText: alignLeftRight(
      `Closed: `,
      billPeriod.closedAt ? dayjs(billPeriod.closedAt).format('DD/MM/YYYY HH:mm:ss') : '',
      Math.round(printer.printWidth / 2),
    ),
  });

  const itemVoidCommands = await itemsReport({ bills, billItems: voids, printer, currency });
  const itemCancelCommands = await itemsReport({ bills, billItems: cancels, printer, currency });

  commands.push(starDivider(printer.printWidth));
  addHeader(commands, alignCenter('Voids', printer.printWidth), printer.printWidth);
  commands.push(starDivider(printer.printWidth));
  commands.push(...itemVoidCommands);

  commands.push(starDivider(printer.printWidth));
  addHeader(commands, alignCenter('Cancels', printer.printWidth), printer.printWidth);
  commands.push(starDivider(printer.printWidth));
  commands.push(...itemCancelCommands);

  return receiptTempate(commands, organization, printer.printWidth);
};

type ReportProps = {
  bills: Bill[];
  billItems: BillItem[];
  printer: Printer;
  currency: string;
};
const itemsReport = async ({ bills, billItems, printer, currency }: ReportProps): Promise<string[]> => {
  let commands = [];
  const sorter = (bill1: Bill, bill2: Bill) => bill2.createdAt - bill1.createdAt;

  // filter any bills that dont contain any voids
  const filteredBills = bills.filter(({ id }) => billItems.some(({ billId }) => billId === id));

  const sortedBillsCreatedAsc = filteredBills.sort(sorter);

  const groupedVoidsByBillId = groupBy(billItems, item => item.billId);

  const combinedBillsItemsMods = await Promise.all(
    sortedBillsCreatedAsc.map(async bill => {
      const voidedModifiers = await bill.billModifierItemVoids.fetch();
      const groupedVoidsByBillItem = groupBy(voidedModifiers, voidedModifier => voidedModifier.billItemId);

      const billItemVoidsWithModifiers = groupedVoidsByBillId[bill.id].map(billItem => {
        const modifiers = groupedVoidsByBillItem[billItem.id];
        return {
          billItem,
          modifiers: modifiers || [],
        };
      });

      return {
        bill,
        billItemVoids: billItemVoidsWithModifiers,
      };
    }),
  );

  const total = combinedBillsItemsMods.reduce((acc, { billItemVoids }) => {
    const itemTotal = billItemVoids.reduce((acc, { billItem, modifiers }) => {
      const modifierTotal = sumBy(modifiers, modifier => modifier.modifierItemPrice);
      const billItemTotal = billItem.itemPrice + modifierTotal;
      return acc + billItemTotal;
    }, 0);
    return acc + itemTotal;
  }, 0);

  combinedBillsItemsMods.map(({ billItemVoids, bill }) => {
    addHeader(commands, `Bill: ${bill.id}`, printer.printWidth);
    commands.push({
      appendBitmapText: alignLeftRight(
        `Opened: `,
        dayjs(bill.createdAt).format('DD/MM/YYYY HH:mm:ss'),
        Math.round(printer.printWidth / 2),
      ),
    });

    commands.push({
      appendBitmapText: alignLeftRight(
        `Closed: `,
        bill.closedAt ? dayjs(bill.closedAt).format('DD/MM/YYYY HH:mm:ss') : '',
        Math.round(printer.printWidth / 2),
      ),
    });

    billItemVoids.map(({ billItem, modifiers }) => {
      commands.push({ appendBitmapText: dayjs(billItem.voidedAt).format('DD/MM/YYYY HH:mm:ss') });
      commands.push({
        appendBitmapText: alignLeftRight(
          capitalize(billItem.itemName),
          formatNumber(billItem.itemPrice, currency),
          printer.printWidth,
        ),
      });
      modifiers.map(mod => {
        commands.push({
          appendBitmapText: alignLeftRight(
            `${modPrefix} ${capitalize(mod.modifierItemName)}`,
            formatNumber(mod.modifierItemPrice, currency),
            printer.printWidth,
          ),
        });
      });

      if (billItem.reasonName || billItem.reasonDescription) {
        commands.push({
          appendBitmapText: billItem.reasonName,
        });
        commands.push({
          appendBitmapText: billItem.reasonDescription,
        });
      }
    });
  });

  commands.push(starDivider(printer.printWidth));
  commands.push({
    appendBitmapText: alignLeftRight(`Total: `, formatNumber(total, currency), printer.printWidth),
  });

  return commands;
};
