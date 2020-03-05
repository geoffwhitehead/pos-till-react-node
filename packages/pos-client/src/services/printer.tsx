import { StarPRNT } from 'react-native-star-prnt';
import { BillProps } from './schemas';
import { formatNumber, discountBreakdown, totalDiscount, balance, total, totalPayable } from '../utils';
import dayjs from 'dayjs';

const receiptWidth = 39; // TODO: move to settings - printer width
const symbol = '£';
const modPrefix = ' -';
const port = 'TCP:192.168.1.78';

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
const alignLeftRight = (left: string, right: string, rightWidth = 12) => {
  const leftWidth = receiptWidth - rightWidth;
  const lines = Math.ceil(left.length / leftWidth);
  const spaces = receiptWidth * lines - right.length - left.length;
  return `${left}${' '.repeat(spaces)}${right}`;
};

const alignCenter = string => {
  const leftSpaces = Math.floor(receiptWidth / 2 - string.length / 2);
  return `${' '.repeat(leftSpaces)}${string}`;
};

const divider = { appendBitmapText: '-'.repeat(receiptWidth) };

const addHeader = (c: any[], header: string): void => {
  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: header });
  c.push(divider);
};

export async function print(bill: BillProps, openDrawer: boolean = false) {
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

  c.push({ appendBitmapText: alignLeftRight(`Date: ${date}`, `Time: ${time}`, Math.round(receiptWidth / 2)) });
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

  c.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  openDrawer && c.push({ openCashDrawer: 1 });
  try {
    await StarPRNT.print('StarGraphic', c, port);
  } catch (e) {
    console.error(e);
  }
}
