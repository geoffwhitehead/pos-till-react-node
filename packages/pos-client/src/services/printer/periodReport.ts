import {
  formatNumber,
  paymentSummary,
  finalizedDiscountSummary,
  categorySummary,
  modifierSummary,
  priceGroupSummmary,
} from '../../utils';
import { addHeader, alignLeftRight, divider, starDivider, alignCenter, RECEIPT_WIDTH, newLine } from './printer';
import { receiptTempate } from './template';
import { capitalize } from 'lodash';
import dayjs from 'dayjs';
import { flatten, sumBy } from 'lodash';
import { tableNames, BillPeriod } from '../../models';
import { Database } from '@nozbe/watermelondb';

const symbol = '£'; // TODO: move

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


  // TODO type this func
export const periodReport = async (billPeriod: BillPeriod, database: Database) => {
  let c = [];

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
      .get(tableNames.categories)
      .query()
      .fetch(),
    database.collections
      .get(tableNames.paymentTypes)
      .query()
      .fetch(),
    database.collections
      .get(tableNames.discounts)
      .query()
      .fetch(),
    database.collections
      .get(tableNames.priceGroups)
      .query()
      .fetch(),
  ]);

  const [billModifierItems, billModifierItemVoids] = await Promise.all([
    flatten(await Promise.all(bills.map(async b => await b.billModifierItems.fetch()))),
    flatten(await Promise.all(bills.map(async b => await b.billModifierItemVoids.fetch()))),
  ]);

  const categoryTotals = categorySummary(periodItems);
  const modifierTotals = modifierSummary(billModifierItems);

  c.push(starDivider);
  c.push({ appendBitmapText: alignCenter(billPeriod.closedAt ? '-- END PERIOD REPORT --' : '-- STATUS REPORT --') });

  console.log('billPeriod', billPeriod);
  c.push({
    appendBitmapText: alignLeftRight(
      `Opened: `,
      dayjs(billPeriod.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(RECEIPT_WIDTH / 2),
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      `Closed: `,
      billPeriod.closedAt ? dayjs(billPeriod.closedAt).format('DD/MM/YYYY HH:mm:ss') : '',
      Math.round(RECEIPT_WIDTH / 2),
    ),
  });
  c.push(starDivider);

  addHeader(c, 'Bills');
  c.push({ appendBitmapText: alignLeftRight('Total: ', bills.length.toString()) });

  addHeader(c, 'Category Totals');
  c.push(
    ...categoryTotals.breakdown.map(categoryTotal => {
      return {
        appendBitmapText: alignLeftRight(
          capitalize(categories.find(c => c.id === categoryTotal.categoryId).name),
          `${categoryTotal.count} / ${formatNumber(categoryTotal.total, symbol)}`,
        ),
      };
    }),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${categoryTotals.count} / ${formatNumber(categoryTotals.total, symbol)}`,
    ),
  });

  addHeader(c, 'Modifier Totals');
  modifierTotals.breakdown.map(modifierGroup => {
    c.push({
      appendBitmapText: alignCenter(modifierGroup.modifierName),
    });
    c.push(
      ...modifierGroup.breakdown.map(modifierItemGroup => {
        return {
          appendBitmapText: alignLeftRight(
            capitalize(modifierItemGroup.modifierItemName),
            `${modifierItemGroup.count} / ${formatNumber(modifierItemGroup.total, symbol)}`,
          ),
        };
      }),
    );
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${modifierTotals.count} / ${formatNumber(modifierTotals.total, symbol)}`,
    ),
  });

  addHeader(c, 'Discount Totals');
  const discountTotals = finalizedDiscountSummary(periodDiscounts, discounts);
  c.push(
    ...discountTotals.breakdown.map(discountTotal => ({
      appendBitmapText: alignLeftRight(
        capitalize(discountTotal.name),
        `${discountTotal.count} / ${formatNumber(discountTotal.total, symbol)}`,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${discountTotals.count} / ${formatNumber(discountTotals.total, symbol)}`,
    ),
  });
  c.push(divider);

  addHeader(c, 'Payment Totals');
  const paymentTotals = paymentSummary(periodPayments, paymentTypes);
  c.push(
    ...paymentTotals.breakdown.map(paymentTotal => ({
      appendBitmapText: alignLeftRight(
        capitalize(paymentTotal.name),
        `${paymentTotal.count} / ${formatNumber(paymentTotal.total, symbol)}`,
      ),
    })),
  );
  c.push({
    appendBitmapText: alignLeftRight(
      'Total: ',
      `${paymentTotals.count} / ${formatNumber(paymentTotals.total, symbol)}`,
    ),
  });

  addHeader(c, 'Voids / Corrections');
  const voidTotal = sumBy(periodItemVoids, 'itemPrice') + sumBy(billModifierItemVoids, 'modifierItemPrice');
  // dont include modifier items in the count as these are cancelled as part od the item.
  const voidCount = periodItemVoids.length;
  c.push({
    appendBitmapText: alignLeftRight('Total: ', `${voidCount} / ${formatNumber(voidTotal, symbol)}`),
  });

  addHeader(c, 'Totals');

  const priceGroupTotals = priceGroupSummmary(periodItems, billModifierItems, priceGroups);

  c.push(
    ...priceGroupTotals.map(priceGroupTotal => {
      return {
        appendBitmapText: alignLeftRight(
          priceGroupTotal.name,
          `${priceGroupTotal.count} / ${formatNumber(priceGroupTotal.total, symbol)}`,
        ),
      };
    }),
  );
  const billItemsTotal = sumBy(periodItems, 'itemPrice');
  const billModifierItemsTotal = sumBy(billModifierItems, 'modifierItemPrice');
  const salesTotal = billItemsTotal + billModifierItemsTotal - discountTotals.total;
  c.push({ appendBitmapText: alignLeftRight('Sales Total: ', formatNumber(salesTotal, symbol)) });

  return receiptTempate(c, org);
};
