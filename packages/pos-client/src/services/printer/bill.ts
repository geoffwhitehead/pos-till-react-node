import { BillProps } from '../schemas';
import { StarPRNT } from 'react-native-star-prnt';
import { formatNumber, total, discountBreakdown, totalPayable, balance } from '../../utils';
import { alignCenter, alignLeftRight, addHeader, divider, RECEIPT_WIDTH } from './printer';
import dayjs from 'dayjs';

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

export const receiptBill = (bill: BillProps) => {
  let c = [];

  c.push({ appendCodePage: StarPRNT.CodePageType.CP858 });
  c.push({ appendEncoding: StarPRNT.Encoding.USASCII });
  c.push({ appendInternational: StarPRNT.InternationalType.UK });
  c.push({ appendFontStyle: 'B' });

  c.push({ appendBitmapText: ' ' });

  c.push({ appendBitmapText: alignCenter(org.name) });
  c.push({ appendBitmapText: alignCenter(org.line1) });
  org.line2 && c.push({ appendBitmapText: alignCenter(org.line2) });
  c.push({ appendBitmapText: alignCenter(org.city) });
  c.push({ appendBitmapText: alignCenter(org.county) });
  c.push({ appendBitmapText: alignCenter(org.postcode) });
  c.push({ appendBitmapText: ' ' });

  c.push({ appendBitmapText: alignLeftRight(`Date: ${date}`, `Time: ${time}`, Math.round(RECEIPT_WIDTH / 2)) });
  c.push({ appendBitmapText: ' ' });

  addHeader(c, 'Items');
  bill.items.map(item => {
    c.push({ appendBitmapText: alignLeftRight(item.name, formatNumber(item.price, symbol)) });
    item.mods.map(mod => {
      c.push({ appendBitmapText: alignLeftRight(modPrefix + mod.name, formatNumber(mod.price, symbol)) });
    });
  });
  c.push({ appendBitmapText: alignLeftRight('TOTAL: ', formatNumber(total(bill), symbol)) });

  bill.discounts && addHeader(c, 'Discounts');
  discountBreakdown(bill).map(discount => {
    c.push({
      appendBitmapText: alignLeftRight(discount.name, `-${formatNumber(discount.calculatedDiscount, symbol)}`),
    });
  });

  bill.payments && addHeader(c, 'Payments');
  bill.payments.map(payment => {
    c.push({
      appendBitmapText: alignLeftRight(payment.paymentType, formatNumber(payment.amount, symbol)),
    });
  });

  addHeader(c, 'Totals');
  c.push({ appendBitmapText: alignLeftRight('Subtotal: ', formatNumber(totalPayable(bill), symbol)) });
  const bal = balance(bill);
  c.push({ appendBitmapText: alignLeftRight('Amount Due: ', formatNumber(Math.max(0, bal), symbol)) });
  if (bal <= 0) {
    c.push({ appendBitmapText: alignLeftRight('Change Due: ', formatNumber(Math.abs(bal), symbol)) });
  }
  c.push(divider);

  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: alignCenter(`VAT: ${org.vat}`) });
  c.push({ appendBitmapText: ' ' });

  return c;
};
