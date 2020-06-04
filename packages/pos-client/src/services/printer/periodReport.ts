import {
  BillProps,
  CategoryProps,
  DiscountProps,
  PaymentTypeProps,
  BillItemProps,
  BillPaymentProps,
  BillPeriodProps,
} from '../schemas';
import {
  totalBillsPaymentBreakdown,
  discountBreakdownTotals,
  billItemsCategoryTotals,
  formatNumber,
} from '../../utils';
import { Collection } from 'realm';
import { addHeader, alignLeftRight, divider, starDivider, alignCenter, RECEIPT_WIDTH, newLine } from './printer';
import { receiptTempate } from './template';
import { capitalize } from 'lodash';
import dayjs from 'dayjs';
import { flatten } from 'lodash';
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

const printGroupCommands: (
  group: Record<string, number>,
  nameResolver: (id: string) => string,
  symbol: string,
) => Record<any, any>[] = (group, nameResolver, symbol) =>
  Object.keys(group).reduce((acc, id) => {
    return [
      ...acc,
      {
        appendBitmapText: alignLeftRight(capitalize(nameResolver(id)), formatNumber(group[id], symbol)),
      },
    ];
  }, []);
  
export const periodReport = async billPeriod => {
  let c = [];

  const [periodItems, periodItemVoids, periodDiscounts, periodPayments, bills] = await Promise.all([
    billPeriod.periodItems.fetch(),
    billPeriod.periodItemVoids.fetch(),
    billPeriod.periodDiscounts.fetch(),
    billPeriod.periodPayments.fetch(),
    billPeriod.bills.fetch(),
  ]);

  const [billModifierItems, billModifierItemVoids] = await Promise.all([
    flatten(await Promise.all(bills.map(async b => await b.billModifierItems.fetch()))),
    flatten(await Promise.all(bills.map(async b => await b.billModifierItemVoids.fetch()))),
  ]);
  console.log('periodItems', periodItems);
  console.log('billModifierItems', billModifierItems);
  console.log('billModifierItemVoids', billModifierItemVoids);
  // const billModifierItemVoids = await Promise.all(bills.map(b => b.billModifierItemVoids));

  c.push(starDivider);
  c.push({ appendBitmapText: alignCenter('PERIOD REPORT') });

  c.push({
    appendBitmapText: alignLeftRight(
      `Opened: `,
      dayjs(billPeriod.createdAt).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(RECEIPT_WIDTH / 2),
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight(`Closed: `, dayjs().format('DD/MM/YYYY HH:mm:ss'), Math.round(RECEIPT_WIDTH / 2)),
  });
  c.push(starDivider);


  addHeader(c, 'Sales');
  c.push({ appendBitmapText: alignLeftRight('Total: ', bills.length.toString()) });

  addHeader(c, 'Category Totals');
  c.push(...printGroupCommands(categoryTotals, id => resolveName(id, categories), symbol));
  

  return receiptTempate(c, org);
};

export const _periodReport = (
  billPeriod: BillPeriodProps,
  bills: Collection<BillProps>,
  categories: Collection<CategoryProps>,
  discounts: Collection<DiscountProps>,
  paymentTypes: Collection<PaymentTypeProps>,
) => {
  const resolveName: (id: string, collection: Collection<{ _id: string; name: string }>) => string = (id, collection) =>
    collection.find(({ _id }) => _id === id).name;

  const printGroupCommands: (
    group: Record<string, number>,
    nameResolver: (id: string) => string,
    symbol: string,
  ) => Record<any, any>[] = (group, nameResolver, symbol) =>
    Object.keys(group).reduce((acc, id) => {
      return [
        ...acc,
        {
          appendBitmapText: alignLeftRight(capitalize(nameResolver(id)), formatNumber(group[id], symbol)),
        },
      ];
    }, []);

  const sumObject: (obj: Record<string, number>) => number = obj =>
    Object.keys(obj).reduce((acc, id) => acc + obj[id], 0);

  const categoryTotals = billItemsCategoryTotals(bills, categories);
  const paymentTotals = totalBillsPaymentBreakdown(bills, paymentTypes);
  const discountTotals = discountBreakdownTotals(bills, discounts);
  const grossSalesTotal = sumObject(categoryTotals);
  const discountTotal = sumObject(discountTotals);
  const netSalesTotal = grossSalesTotal - discountTotal;

  // number of bills

  // number of voids

  let c = [];

  const isZReport = !!billPeriod.closed;

  console.log('isZReport', isZReport);

  console.log('billPeriod', billPeriod);
  // c.push(starDivider);
  // c.push({ appendBitmapText: alignCenter(isZReport ? 'Z-REPORT (CLOSED)' : 'X-REPORT (OPEN)') });
  // c.push({
  //   appendBitmapText: alignLeftRight(
  //     `Opened: `,
  //     dayjs(billPeriod.opened).format('DD/MM/YYYY HH:mm:ss'),
  //     Math.round(RECEIPT_WIDTH / 2),
  //   ),
  // });
  // c.push({
  //   appendBitmapText: alignLeftRight(
  //     `Closed: `,
  //     isZReport ? dayjs(billPeriod.opened).format('DD/MM/YYYY HH:mm:ss') : '',
  //     Math.round(RECEIPT_WIDTH / 2),
  //   ),
  // });
  // c.push(starDivider);

  // addHeader(c, 'Sales');
  // c.push({ appendBitmapText: alignLeftRight('Total: ', bills.length.toString()) });

  // addHeader(c, 'Category Totals');
  // c.push(...printGroupCommands(categoryTotals, id => resolveName(id, categories), symbol));
  addHeader(c, 'Payment Totals');
  c.push(...printGroupCommands(paymentTotals, id => resolveName(id, paymentTypes), symbol));
  console.log('c', c);

  addHeader(c, 'Discount Totals');
  c.push(...printGroupCommands(discountTotals, id => resolveName(id, discounts), symbol));
  c.push(divider);
  c.push({ appendBitmapText: alignLeftRight('Gross Sales Total: ', formatNumber(grossSalesTotal, symbol)) });
  c.push({ appendBitmapText: alignLeftRight('Discount Total: ', formatNumber(discountTotal, symbol)) });
  c.push({ appendBitmapText: alignLeftRight('Net Sales Total: ', formatNumber(netSalesTotal, symbol)) });
  c.push({ appendBitmapText: alignLeftRight('Grand Total: ', formatNumber(sumObject(paymentTotals), symbol)) });

  // return receiptTempate(c, org);
};
