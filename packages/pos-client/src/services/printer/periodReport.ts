import { Database } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { capitalize, flatten, sumBy } from 'lodash';
import {
  Bill,
  BillItem,
  BillItemModifierItem,
  BillPeriod,
  Category,
  Discount,
  Organization,
  PaymentType,
  PriceGroup,
  Printer,
  tableNames,
} from '../../models';
import {
  categorySummary,
  finalizedDiscountSummary,
  formatNumber,
  getItemPrice,
  getModifierItemPrice,
  modifierSummary,
  paymentSummary,
  priceGroupSummmary,
} from '../../utils';
import { addHeader, alignCenter, alignLeftRight, divider, starDivider } from './helpers';
import { receiptTempate } from './template';

type PeriodReportProps = {
  billPeriod: BillPeriod;
  database: Database;
  printer: Printer;
  organization: Organization;
};

type PeriodReportDataProps = {
  billPeriod: BillPeriod;
  database: Database;
};

export type PeriodReportData = {
  bills: Bill[];
  billItems: BillItem[];
  categories: Category[];
  categoryTotals: ReturnType<typeof categorySummary>;
  modifierTotals: ReturnType<typeof modifierSummary>;
  discountTotals: ReturnType<typeof finalizedDiscountSummary>;
  paymentTotals: ReturnType<typeof paymentSummary>;
  voidTotal: number;
  voidCount: number;
  priceGroupTotals: ReturnType<typeof priceGroupSummmary>;
  salesTotal: number;
  compBillItems: BillItem[];
  compBillItemModifierItems: BillItemModifierItem[];
};

export const periodReportData = async ({ billPeriod, database }: PeriodReportDataProps): Promise<PeriodReportData> => {
  const [
    billItems,
    periodItemVoidsAndCancels,
    periodDiscounts,
    periodPayments,
    bills,
    categories,
    paymentTypes,
    discounts,
    priceGroups,
  ] = await Promise.all([
    billPeriod.periodItems.fetch(),
    billPeriod.periodItemVoidsAndCancels.fetch(),
    billPeriod.periodDiscounts.fetch(),
    billPeriod.periodPayments.fetch(),
    billPeriod.bills.fetch(),
    database.collections
      .get<Category>(tableNames.categories)
      .query()
      .fetch(),
    database.collections
      .get<PaymentType>(tableNames.paymentTypes)
      .query()
      .fetch(),
    database.collections
      .get<Discount>(tableNames.discounts)
      .query()
      .fetch(),
    database.collections
      .get<PriceGroup>(tableNames.priceGroups)
      .query()
      .fetch(),
  ]);

  /**
   * Note: Some of the queries here are combining comp and chargable items. This is needed as some of the
   * breakdowns will count the comp. The price will be set to 0 for comp items.
   */
  const [billModifierItems, billModifierItemVoids] = await Promise.all([
    flatten(await Promise.all(bills.map(async b => await b.billModifierItems.fetch()))),
    flatten(await Promise.all(bills.map(async b => await b.billModifierItemVoids.fetch()))),
  ]);

  const categoryTotals = categorySummary(billItems);
  const modifierTotals = modifierSummary(billModifierItems);
  const discountTotals = finalizedDiscountSummary(periodDiscounts, discounts);
  const paymentTotals = paymentSummary(periodPayments, paymentTypes);
  const voidTotal = sumBy(periodItemVoidsAndCancels, 'itemPrice') + sumBy(billModifierItemVoids, 'modifierItemPrice');
  // dont include modifier items in the count as these are cancelled as part od the item.
  const voidCount = periodItemVoidsAndCancels.length;
  const priceGroupTotals = priceGroupSummmary(billItems, billModifierItems, priceGroups);
  const billItemsTotal = sumBy(billItems, item => getItemPrice(item));
  const billModifierItemsTotal = sumBy(billModifierItems, mod => getModifierItemPrice(mod));
  const salesTotal = billItemsTotal + billModifierItemsTotal - discountTotals.total;
  const compBillItems = billItems.filter(item => item.isComp);
  const compBillItemModifierItems = billModifierItems.filter(mod => mod.isComp);

  return {
    bills,
    billItems,
    categories,
    categoryTotals,
    modifierTotals,
    discountTotals,
    paymentTotals,
    voidTotal,
    voidCount,
    priceGroupTotals,
    salesTotal,
    compBillItems,
    compBillItemModifierItems,
  };
};

export const periodReport = async ({ billPeriod, database, printer, organization }: PeriodReportProps) => {
  let c = [];

  const {
    bills,
    billItems,
    categories,
    categoryTotals,
    modifierTotals,
    discountTotals,
    paymentTotals,
    voidTotal,
    voidCount,
    priceGroupTotals,
    salesTotal,
    compBillItems,
    compBillItemModifierItems,
  } = await periodReportData({ billPeriod, database });

  const { currency } = organization;

  c.push(starDivider(printer.printWidth));
  c.push({
    appendBitmapText: alignCenter(
      billPeriod.closedAt ? '-- END PERIOD REPORT --' : '-- STATUS REPORT --',
      printer.printWidth,
    ),
  });

  c.push({
    appendBitmapText: alignLeftRight(
      `Opened: `,
      dayjs(billPeriod.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(printer.printWidth / 2),
    ),
  });

  c.push({
    appendBitmapText: alignLeftRight(
      `Closed: `,
      billPeriod.closedAt ? dayjs(billPeriod.closedAt).format('DD/MM/YYYY HH:mm:ss') : '',
      Math.round(printer.printWidth / 2),
    ),
  });

  c.push(starDivider(printer.printWidth));

  addHeader(c, 'Category Totals', printer.printWidth);
  c.push(
    ...categoryTotals.breakdown.map(categoryTotal => {
      return {
        appendBitmapText: alignLeftRight(
          capitalize(categories.find(c => c.id === categoryTotal.categoryId).name),
          `${categoryTotal.count} / ${formatNumber(categoryTotal.total, currency)}`,
          printer.printWidth,
        ),
      };
    }),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${categoryTotals.count} / ${formatNumber(categoryTotals.total, currency)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Modifier Totals', printer.printWidth);
  modifierTotals.breakdown.map(modifierGroup => {
    c.push({
      appendBitmapText: alignCenter(modifierGroup.modifierName, printer.printWidth),
    });
    c.push(
      ...modifierGroup.breakdown.map(modifierItemGroup => {
        return {
          appendBitmapText: alignLeftRight(
            capitalize(modifierItemGroup.modifierItemName),
            `${modifierItemGroup.count} / ${formatNumber(modifierItemGroup.total, currency)}`,
            printer.printWidth,
          ),
        };
      }),
    );
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${modifierTotals.count} / ${formatNumber(modifierTotals.total, currency)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Price Group Totals (excl discounts)', printer.printWidth);
  c.push(
    ...priceGroupTotals.map(priceGroupTotal => {
      return {
        appendBitmapText: alignLeftRight(
          priceGroupTotal.name,
          `${priceGroupTotal.count} / ${formatNumber(priceGroupTotal.total, currency)}`,
          printer.printWidth,
        ),
      };
    }),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${sumBy(priceGroupTotals, ({ count }) => count)} / ${formatNumber(
        sumBy(priceGroupTotals, ({ total }) => total),
        currency,
      )}`,
      printer.printWidth,
    ),
  });
  addHeader(c, 'Discount Totals', printer.printWidth);
  c.push(
    ...discountTotals.breakdown.map(discountTotal => ({
      appendBitmapText: alignLeftRight(
        capitalize(discountTotal.name),
        `${discountTotal.count} / ${formatNumber(discountTotal.total, currency)}`,
        printer.printWidth,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${discountTotals.count} / ${formatNumber(discountTotals.total, currency)}`,
      printer.printWidth,
    ),
  });
  c.push(divider(printer.printWidth));

  addHeader(c, 'Payment Totals', printer.printWidth);
  c.push(
    ...paymentTotals.breakdown.map(paymentTotal => ({
      appendBitmapText: alignLeftRight(
        capitalize(paymentTotal.name),
        `${paymentTotal.count} / ${formatNumber(paymentTotal.total, currency)}`,
        printer.printWidth,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${paymentTotals.count} / ${formatNumber(paymentTotals.total, currency)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Complimentary Totals', printer.printWidth);

  c.push({
    appendBitmapText: alignLeftRight(
      'Items',
      `${compBillItems.length} / ${formatNumber(sumBy(compBillItems, 'itemPrice'), currency)}`,
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Modifiers',
      `${compBillItemModifierItems.length} / ${formatNumber(
        sumBy(compBillItemModifierItems, 'modifierItemPrice'),
        currency,
      )}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Totals', printer.printWidth);
  c.push({ appendBitmapText: alignLeftRight('Number of bills: ', bills.length.toString(), printer.printWidth) });
  c.push({
    appendBitmapText: alignLeftRight(
      'Voids: ',
      `${voidCount} / ${formatNumber(voidTotal, currency)}`,
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Discounts: ',
      `${discountTotals.count} / ${formatNumber(discountTotals.total, currency)}`,
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight('Sales Total: ', formatNumber(salesTotal, currency), printer.printWidth),
  });

  return receiptTempate(c, organization, printer.printWidth);
};
