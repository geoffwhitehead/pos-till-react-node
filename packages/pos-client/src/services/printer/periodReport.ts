import { BillProps, CategoryProps, DiscountProps, PaymentTypeProps, BillItemProps, BillPaymentProps } from '../schemas';
import {
  totalBillsPaymentBreakdown,
  discountBreakdownTotals,
  billItemsCategoryTotals,
  formatNumber,
} from '../../utils';
import { Collection } from 'realm';
import { addHeader, alignLeftRight, divider } from './printer';
import { receiptTempate } from './template';
import { capitalize } from 'lodash';

const symbol = '£';

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

export const periodReport = (
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

  c.push({ appendBitmapText: alignLeftRight('Sales: ', bills.length.toString()) });

  addHeader(c, 'Category Totals');
  c.push(...printGroupCommands(categoryTotals, id => resolveName(id, categories), symbol));
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

  return receiptTempate(c, org);
};
