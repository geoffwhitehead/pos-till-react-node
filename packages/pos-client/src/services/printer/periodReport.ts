import {
  formatNumber,
  paymentSummary,
  finalizedDiscountSummary,
  categorySummary,
  modifierSummary,
  priceGroupSummmary,
  getItemPrice,
  getModifierItemPrice,
  getSymbol,
} from '../../utils';
import { addHeader, alignLeftRight, divider, starDivider, alignCenter } from './helpers';
import { receiptTempate } from './template';
import { capitalize } from 'lodash';
import dayjs from 'dayjs';
import { flatten, sumBy } from 'lodash';
import { tableNames, BillPeriod, Category, PaymentType, Discount, PriceGroup, Printer } from '../../models';
import { Database } from '@nozbe/watermelondb';

// TODO: fetch from db
const org = {
  name: 'Nadon Thai Restaurant',
  line1: '12a Newgate St',
  line2: '',
  city: 'Morpeth',
  county: 'Northumberland',
  postcode: 'NE61 1BA',
  vat: '123 345 567',
};

// const printGroupCommands: (
//   group: Record<string, number>,
//   nameResolver: (id: string) => string,
//   symbol: string,
// ) => Record<any, any>[] = (group, nameResolver, symbol) =>
//   Object.keys(group).reduce((acc, id) => {
//     return [
//       ...acc,
//       {
//         appendBitmapText: alignLeftRight(capitalize(nameResolver(id)), formatNumber(group[id], symbol)),
//       },
//     ];
//   }, []);

export const periodReport = async (billPeriod: BillPeriod, database: Database, printer: Printer, currency: string) => {
  let c = [];

  const currencySymbol = getSymbol(currency);

  const [
    periodItems,
    periodItemVoids,
    periodDiscounts,
    periodPayments,
    bills,
    categories,
    paymentTypes,
    discounts,
    priceGroups,
  ] = await Promise.all([
    billPeriod.periodItems.fetch(),
    billPeriod.periodItemVoids.fetch(),
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
          `${categoryTotal.count} / ${formatNumber(categoryTotal.total, currencySymbol)}`,
          printer.printWidth,
        ),
      };
    }),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${categoryTotals.count} / ${formatNumber(categoryTotals.total, currencySymbol)}`,
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
            `${modifierItemGroup.count} / ${formatNumber(modifierItemGroup.total, currencySymbol)}`,
            printer.printWidth,
          ),
        };
      }),
    );
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${modifierTotals.count} / ${formatNumber(modifierTotals.total, currencySymbol)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Discount Totals', printer.printWidth);
  const discountTotals = finalizedDiscountSummary(periodDiscounts, discounts);
  c.push(
    ...discountTotals.breakdown.map(discountTotal => ({
      appendBitmapText: alignLeftRight(
        capitalize(discountTotal.name),
        `${discountTotal.count} / ${formatNumber(discountTotal.total, currencySymbol)}`,
        printer.printWidth,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${discountTotals.count} / ${formatNumber(discountTotals.total, currencySymbol)}`,
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
        `${paymentTotal.count} / ${formatNumber(paymentTotal.total, currencySymbol)}`,
        printer.printWidth,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${paymentTotals.count} / ${formatNumber(paymentTotals.total, currencySymbol)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Voids / Corrections', printer.printWidth);
  const voidTotal = sumBy(periodItemVoids, 'itemPrice') + sumBy(billModifierItemVoids, 'modifierItemPrice');
  // dont include modifier items in the count as these are cancelled as part od the item.
  const voidCount = periodItemVoids.length;
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${voidCount} / ${formatNumber(voidTotal, currencySymbol)}`,
      printer.printWidth,
    ),
  });

  addHeader(c, 'Complimentary Totals', printer.printWidth);
  const compItems = periodItems.filter(item => item.isComp);
  const compMods = billModifierItems.filter(mod => mod.isComp);

  c.push({
    appendBitmapText: alignLeftRight(
      'Items',
      `${compItems.length} / ${formatNumber(sumBy(compItems, 'itemPrice'), currencySymbol)}`,
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Modifiers',
      `${compMods.length} / ${formatNumber(sumBy(compMods, 'modifierItemPrice'), currencySymbol)}`,
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
          `${priceGroupTotal.count} / ${formatNumber(priceGroupTotal.total, currencySymbol)}`,
          printer.printWidth,
        ),
      };
    }),
  );
  const billItemsTotal = sumBy(periodItems, item => getItemPrice(item));
  const billModifierItemsTotal = sumBy(billModifierItems, mod => getModifierItemPrice(mod));
  const salesTotal = billItemsTotal + billModifierItemsTotal - discountTotals.total;
  c.push({
    appendBitmapText: alignLeftRight('Sales Total: ', formatNumber(salesTotal, currencySymbol), printer.printWidth),
  });

  return receiptTempate(c, org, printer.printWidth);
};
