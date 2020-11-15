import { Database } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { capitalize, flatten, sumBy } from 'lodash';
import {
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

export const periodReport = async ({ billPeriod, database, printer, organization }: PeriodReportProps) => {
  let c = [];

  const { currency } = organization;

  const [
    periodItems,
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

  const categoryTotals = categorySummary(periodItems);
  const modifierTotals = modifierSummary(billModifierItems);

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

  addHeader(c, 'Bills', printer.printWidth);
  c.push({ appendBitmapText: alignLeftRight('Total: ', bills.length.toString(), printer.printWidth) });

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

  addHeader(c, 'Discount Totals', printer.printWidth);
  const discountTotals = finalizedDiscountSummary(periodDiscounts, discounts);
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
  const paymentTotals = paymentSummary(periodPayments, paymentTypes);
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

  addHeader(c, 'Voids', printer.printWidth);
  const voidTotal = sumBy(periodItemVoidsAndCancels, 'itemPrice') + sumBy(billModifierItemVoids, 'modifierItemPrice');
  // dont include modifier items in the count as these are cancelled as part od the item.
  const voidCount = periodItemVoidsAndCancels.length;
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${voidCount} / ${formatNumber(voidTotal, currency)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Complimentary Totals', printer.printWidth);
  const compItems = periodItems.filter(item => item.isComp);
  const compMods = billModifierItems.filter(mod => mod.isComp);

  c.push({
    appendBitmapText: alignLeftRight(
      'Items',
      `${compItems.length} / ${formatNumber(sumBy(compItems, 'itemPrice'), currency)}`,
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Modifiers',
      `${compMods.length} / ${formatNumber(sumBy(compMods, 'modifierItemPrice'), currency)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Totals', printer.printWidth);

  const priceGroupTotals = priceGroupSummmary(periodItems, billModifierItems, priceGroups);

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
  const billItemsTotal = sumBy(periodItems, item => getItemPrice(item));
  const billModifierItemsTotal = sumBy(billModifierItems, mod => getModifierItemPrice(mod));
  const salesTotal = billItemsTotal + billModifierItemsTotal - discountTotals.total;
  c.push({
    appendBitmapText: alignLeftRight('Sales Total: ', formatNumber(salesTotal, currency), printer.printWidth),
  });

  return receiptTempate(c, organization, printer.printWidth);
};
