import { BillProps } from '../schemas';
import { StarPRNT } from 'react-native-star-prnt';
import { formatNumber, total, discountBreakdown, totalPayable, balance } from '../../utils';
import { alignCenter, alignLeftRight, addHeader, divider, RECEIPT_WIDTH, alignRight } from './printer';
import dayjs from 'dayjs';
import { receiptTempate } from './template';
import { capitalize, chain, groupBy } from 'lodash';

const symbol = '£';
const modPrefix = ' -';

const org = {
  name: 'Nadon Thai Restaurant',
  line1: '12a Newgate St',
  line2: '',
  city: 'Morpeth',
  county: 'Northumberland',
  postcode: 'NE61 1BA',
  vat: '123 345 567',
};

export const receiptBill = (bill: BillProps) => {
  let c = [];

  addHeader(c, 'Items');

  const itemGroups = groupBy(bill.items, item => item.priceGroup._id);

  Object.values(itemGroups).map(group => {
    c.push({ appendBitmapText: alignCenter(group[0].priceGroup.name) });
    group.map(item => {
      c.push({ appendBitmapText: alignLeftRight(capitalize(item.name), formatNumber(item.price, symbol)) });
      item.mods.map(mod => {
        c.push({ appendBitmapText: alignLeftRight(capitalize(modPrefix + mod.name), formatNumber(mod.price, symbol)) });
      });
    });
  });

  c.push({ appendBitmapText: alignRight(`Total: ${formatNumber(total(bill), symbol)}`) });

  bill.discounts.length > 0 && addHeader(c, 'Discounts');
  discountBreakdown(bill).map(discount => {
    c.push({
      appendBitmapText: alignLeftRight(
        capitalize(discount.name),
        `-${formatNumber(discount.calculatedDiscount, symbol)}`,
      ),
    });
  });

  bill.payments.length > 0 && addHeader(c, 'Payments');
  bill.payments
    .filter(p => !p.isChange)
    .map(payment => {
      c.push({
        appendBitmapText: alignLeftRight(capitalize(payment.paymentType), formatNumber(payment.amount, symbol)),
      });
    });

  addHeader(c, 'Totals');
  c.push({ appendBitmapText: alignLeftRight('Subtotal: ', formatNumber(totalPayable(bill), symbol)) });
  const bal = balance(bill);
  c.push({ appendBitmapText: alignLeftRight('Amount Due: ', formatNumber(Math.max(0, bal), symbol)) });
  const changePayment = bill.payments.find(p => p.isChange);
  if (changePayment) {
    c.push({ appendBitmapText: alignLeftRight('Change Due: ', formatNumber(Math.abs(changePayment.amount), symbol)) });
  }
  c.push(divider);

  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: alignCenter(`VAT: ${org.vat}`) });
  c.push({ appendBitmapText: ' ' });

  return receiptTempate(c, org);
};
