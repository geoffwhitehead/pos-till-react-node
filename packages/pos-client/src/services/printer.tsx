import { StarPRNT } from 'react-native-star-prnt';
import { BillProps } from './schemas';
import { formatNumber, discountBreakdown, totalDiscount, balance, total } from '../utils';

// commands.push({ appendBitmapText: 'Star Clothing Boutique\n' + '123 Star Road\n' + 'City, State 12345\n' + '\n' });
// commands.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });

const receiptWidth = 39; // TODO: move to settings - printer width
const symbol = '£';
const priceWidth = 12;
const itemWidth = receiptWidth - priceWidth;
const modPrefix = ' - ';

const itemWithPriceString = (item: string, price: string) => {
  const lines = Math.ceil(item.length / itemWidth);
  const spaces = receiptWidth * lines - (priceWidth - price.length) - item.length;
  return `${item}${' '.repeat(spaces)}${price}`;
};

const addHeader = (c: any[], header: string): void => {
  c.push({ appendBitmapText: '\n' + '\n' + header });
  c.push({ appendBitmapText: '-'.repeat(receiptWidth) });
};

export async function print(bill: BillProps) {
  console.log('............... bill', bill);

  bill.items.map(i => {
    console.log('i: ', i);
  });
  const port = 'TCP:192.168.1.78';
  let c = [];
  // c.push({ appendCodePage: StarPRNT.CodePageType.CP858 });
  // c.push({ appendEncoding: StarPRNT.Encoding.USASCII });
  // c.push({ appendInternational: StarPRNT.InternationalType.UK });
  c.push({ appendBitmapText: '\n' + new Date().toString() + '\n' });
  addHeader(c, 'Items');

  addHeader(c, 'Items');

  bill.items.map(item => {
    c.push({ appendBitmapText: itemWithPriceString(item.name, formatNumber(item.price, symbol)) });
    item.mods.map(mod => {
      c.push({ appendBitmapText: itemWithPriceString(modPrefix + mod.name, formatNumber(mod.price, symbol)) });
    });
  });

  addHeader(c, 'Discounts');

  discountBreakdown(bill).map(discount => {
    c.push({ appendBitmapText: itemWithPriceString(discount.name, formatNumber(discount.calculatedDiscount, symbol)) });
  });

  addHeader(c, 'Payments');

  bill.payments.map(payment => {
    c.push({
      appendBitmapText: itemWithPriceString(`Payment: ${payment.paymentType}`, formatNumber(payment.amount, symbol)),
    });
  });

  addHeader(c, 'Totals');
  c.push({ appendBitmapText: itemWithPriceString('Discount: ', formatNumber(totalDiscount(bill), symbol)) });
  c.push({ appendBitmapText: itemWithPriceString('Total: ', formatNumber(total(bill), symbol)) });
  const bal = balance(bill);
  c.push({ appendBitmapText: itemWithPriceString('Amount Due: ', formatNumber(Math.max(0, bal), symbol)) });

  if (bal <= 0) {
    c.push({ appendBitmapText: itemWithPriceString('Change Due: ', formatNumber(Math.abs(bal), symbol)) });
  }

  c.push({ appendCutPaper: StarPRNT.CutPaperAction.PartialCutWithFeed });
  try {
    var printResult = await StarPRNT.print('StarGraphic', c, port);
  } catch (e) {
    console.error(e);
  }
}
