import { formatNumber, billSummary, BillSummary } from '../../utils';
import { alignCenter, alignLeftRight, addHeader, divider, alignRight } from './helpers';
import { receiptTempate } from './template';
import { capitalize, groupBy } from 'lodash';
import { BillItem, BillDiscount, BillPayment, Discount, PriceGroup, PaymentType, Printer } from '../../models';

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

export const receiptBill = async (
  billItems: BillItem[],
  billDiscounts: BillDiscount[],
  billPayments: BillPayment[],
  discounts: Discount[],
  priceGroups: PriceGroup[],
  paymentTypes: PaymentType[],
  printer: Printer,
) => {
  const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);

  console.log('billItems', billItems);
  console.log('billDiscounts', billDiscounts);
  console.log('discounts', discounts);
  console.log('billPayments', billPayments);

  let c = [];

  addHeader(c, 'Items', printer.printWidth);

  const lookupPriceGroup = id => priceGroups.find(pG => pG.id === id);
  const lookupPaymentType = id => paymentTypes.find(pT => pT.id === id);

  const itemGroups: Record<string, BillSummary['itemsBreakdown']> = groupBy(
    summary.itemsBreakdown,
    record => record.item.priceGroupId,
  );

  Object.values(itemGroups).map((group, i) => {
    const pG = lookupPriceGroup(Object.keys(itemGroups)[i]);
    c.push({ appendBitmapText: alignCenter(pG.name, printer.printWidth) });
    group.map(({ item, mods, total }) => {
      c.push({
        appendBitmapText: alignLeftRight(
          capitalize(item.itemName),
          formatNumber(item.itemPrice, symbol),
          printer.printWidth,
        ),
      });
      mods.map(mod => {
        c.push({
          appendBitmapText: alignLeftRight(
            `${modPrefix} ${capitalize(mod.modifierItemName)}`,
            formatNumber(mod.modifierItemPrice, symbol),
            printer.printWidth,
          ),
        });
      });
    });
  });

  c.push({ appendBitmapText: alignRight(`Total: ${formatNumber(summary.total, symbol)}`, printer.printWidth) });

  billDiscounts.length > 0 && addHeader(c, 'Discounts', printer.printWidth);

  summary.discountBreakdown.map(discount => {
    c.push({
      appendBitmapText: alignLeftRight(
        capitalize(discount.name),
        `-${formatNumber(discount.calculatedDiscount, symbol)}`,
        printer.printWidth,
      ),
    });
  });

  billPayments.length > 0 && addHeader(c, 'Payments', printer.printWidth);
  billPayments
    .filter(p => !p.isChange)
    .map(payment => {
      const pT = lookupPaymentType(payment.paymentTypeId);
      c.push({
        appendBitmapText: alignLeftRight(capitalize(pT.name), formatNumber(payment.amount, symbol), printer.printWidth),
      });
    });

  addHeader(c, 'Totals', printer.printWidth);
  c.push({
    appendBitmapText: alignLeftRight('Net total: ', formatNumber(summary.totalPayable, symbol), printer.printWidth),
  });
  c.push({
    appendBitmapText: alignLeftRight('Paid: ', formatNumber(summary.totalPayments, symbol), printer.printWidth),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Balance: ',
      formatNumber(Math.max(0, summary.balance), symbol),
      printer.printWidth,
    ),
  });
  const changePayment = billPayments.find(p => p.isChange);
  if (changePayment) {
    c.push({
      appendBitmapText: alignLeftRight(
        'Change: ',
        formatNumber(Math.abs(changePayment.amount), symbol),
        printer.printWidth,
      ),
    });
  }
  c.push(divider(printer.printWidth));

  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: alignCenter(`VAT: ${org.vat}`, printer.printWidth) });
  c.push({ appendBitmapText: ' ' });

  return receiptTempate(c, org, printer.printWidth);
};
