import { BillProps, CategoryProps, DiscountProps, PaymentTypeProps, BillItemProps, BillPaymentProps } from '../schemas';
import { StarPRNT } from 'react-native-star-prnt';
import { formatNumber, total, discountBreakdown, totalPayable, balance, totalBillItem } from '../../utils';
import { alignCenter, alignLeftRight, addHeader, divider, RECEIPT_WIDTH } from './printer';
import dayjs from 'dayjs';
import { Collection, Results } from 'realm';
import { acc } from 'react-native-reanimated';
import { flatten } from 'lodash';

const symbol = '£';
const modPrefix = ' -';

const date = dayjs().format('DD/MM/YYYY');
const time = dayjs().format('HH:mm:ss');
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
  let c = [];

  const allItems: BillItemProps[] = flatten(bills.map(bill => bill.items));
  const allPayments: BillPaymentProps[] = flatten(bills.map(bill => bill.payments));

  const categoryTotals: Record<string, number> = categories.reduce(
    (acc, category) => ({ ...acc, [category._id]: 0 }),
    {},
  );

  const paymentTypeTotals: Record<string, number> = paymentTypes.reduce(
    (acc, paymentType) => ({ ...acc, [paymentType._id]: 0 }),
    {},
  );

  const discountTotals: Record<string, number> = discounts.reduce(
    (acc, discount) => ({ ...acc, [discount.name]: 0 }),
    {},
  );

  const discountsBreakdown: ReturnType<typeof discountBreakdown> = flatten(bills.map(bill => discountBreakdown(bill)));

  const finalPaymentsTotal = allPayments.reduce((acc, payment) => {
    return {
      ...acc,
      [payment._id]: acc[payment._id] + payment.amount,
    };
  }, paymentTypeTotals);

  paymentTypeTotals;

  // totals breakdown by category
  const finalCategoryTotals = allItems.reduce((acc, item) => {
    return {
      ...acc,
      [item.categoryId]: acc[item.categoryId] + totalBillItem(item),
    };
  }, categoryTotals);
  // total discounts

  const finalDiscountTotals = discountsBreakdown.reduce((acc, discount) => {
    return { ...acc, [discount.name]: acc[discount.name] + discount.name };
  }, discountTotals);
  // total voids

  // totals by payment type

  // grand total
  const grandTotal =
    allItems.reduce((acc, item) => acc + item.price, 0) -
    Object.values(finalDiscountTotals).reduce((acc, discount) => acc + discount, 0);

  // net total
console.log('grandTotal', grandTotal)
console.log('finalDiscountTotals', finalDiscountTotals)
console.log('finalCategoryTotals', finalCategoryTotals)
console.log('finalPaymentsTotal', finalPaymentsTotal)

  //   c.push({ appendCodePage: StarPRNT.CodePageType.CP858 });
  //   c.push({ appendEncoding: StarPRNT.Encoding.USASCII });
  //   c.push({ appendInternational: StarPRNT.InternationalType.UK });
  //   c.push({ appendFontStyle: 'B' });

  //   c.push({ appendBitmapText: ' ' });

  //   c.push({ appendBitmapText: alignCenter(org.name) });
  //   c.push({ appendBitmapText: alignCenter(org.line1) });
  //   org.line2 && c.push({ appendBitmapText: alignCenter(org.line2) });
  //   c.push({ appendBitmapText: alignCenter(org.city) });
  //   c.push({ appendBitmapText: alignCenter(org.county) });
  //   c.push({ appendBitmapText: alignCenter(org.postcode) });
  //   c.push({ appendBitmapText: ' ' });

  //   c.push({ appendBitmapText: alignLeftRight(`Date: ${date}`, `Time: ${time}`, Math.round(RECEIPT_WIDTH / 2)) });
  //   c.push({ appendBitmapText: ' ' });

  //   addHeader(c, 'Items');
  //   bill.items.map(item => {
  //     c.push({ appendBitmapText: alignLeftRight(item.name, formatNumber(item.price, symbol)) });
  //     item.mods.map(mod => {
  //       c.push({ appendBitmapText: alignLeftRight(modPrefix + mod.name, formatNumber(mod.price, symbol)) });
  //     });
  //   });
  //   c.push({ appendBitmapText: alignLeftRight('TOTAL: ', formatNumber(total(bill), symbol)) });

  //   bill.discounts && addHeader(c, 'Discounts');
  //   discountBreakdown(bill).map(discount => {
  //     c.push({
  //       appendBitmapText: alignLeftRight(discount.name, `-${formatNumber(discount.calculatedDiscount, symbol)}`),
  //     });
  //   });

  //   bill.payments && addHeader(c, 'Payments');
  //   bill.payments.map(payment => {
  //     c.push({
  //       appendBitmapText: alignLeftRight(payment.paymentType, formatNumber(payment.amount, symbol)),
  //     });
  //   });

  //   addHeader(c, 'Totals');
  //   c.push({ appendBitmapText: alignLeftRight('Subtotal: ', formatNumber(totalPayable(bill), symbol)) });
  //   const bal = balance(bill);
  //   c.push({ appendBitmapText: alignLeftRight('Amount Due: ', formatNumber(Math.max(0, bal), symbol)) });
  //   if (bal <= 0) {
  //     c.push({ appendBitmapText: alignLeftRight('Change Due: ', formatNumber(Math.abs(bal), symbol)) });
  //   }
  //   c.push(divider);

  //   c.push({ appendBitmapText: ' ' });
  //   c.push({ appendBitmapText: alignCenter(`VAT: ${org.vat}`) });
  //   c.push({ appendBitmapText: ' ' });

  return c;
};
