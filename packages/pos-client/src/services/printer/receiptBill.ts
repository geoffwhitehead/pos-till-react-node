import { BillProps } from '../schemas';
import { formatNumber, total, discountBreakdown, totalPayable, balance, billSummary, BillSummary } from '../../utils';
import { alignCenter, alignLeftRight, addHeader, divider, alignRight } from './printer';
import { receiptTempate } from './template';
import { capitalize, groupBy } from 'lodash';

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
  billItems: any,
  billDiscounts: any,
  billPayments: any,
  discounts: any,
  priceGroups: any,
  paymentTypes: any,
) => {
  const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);

  let c = [];

  addHeader(c, 'Items');

  const lookupPriceGroup = id => priceGroups.find(pG => pG.id === id);
  const lookupPaymentType = id => paymentTypes.find(pT => pT.id === id);

  const itemGroups: Record<string, BillSummary['itemsBreakdown']> = groupBy(
    summary.itemsBreakdown,
    record => record.item.priceGroupId,
  );

  Object.values(itemGroups).map((group, i) => {
    const pG = lookupPriceGroup(Object.keys(itemGroups)[i]);
    c.push({ appendBitmapText: alignCenter(pG.name) });
    group.map(({ item, mods, total }) => {
      c.push({ appendBitmapText: alignLeftRight(capitalize(item.itemName), formatNumber(item.itemPrice, symbol)) });
      mods.map(mod => {
        c.push({
          appendBitmapText: alignLeftRight(
            `${modPrefix} ${capitalize(mod.modifierItemName)}`,
            formatNumber(mod.modifierItemPrice, symbol),
          ),
        });
      });
    });
  });

  c.push({ appendBitmapText: alignRight(`Total: ${formatNumber(summary.total, symbol)}`) });

  billDiscounts.length > 0 && addHeader(c, 'Discounts');

  summary.discountBreakdown.map(discount => {
    c.push({
      appendBitmapText: alignLeftRight(
        capitalize(discount.name),
        `-${formatNumber(discount.calculatedDiscount, symbol)}`,
      ),
    });
  });

  billPayments.length > 0 && addHeader(c, 'Payments');
  billPayments
    .filter(p => !p.isChange)
    .map(payment => {
      const pT = lookupPaymentType(payment.paymentTypeId);
      c.push({
        appendBitmapText: alignLeftRight(capitalize(pT.name), formatNumber(payment.amount, symbol)),
      });
    });

  addHeader(c, 'Totals');
  c.push({ appendBitmapText: alignLeftRight('Net total: ', formatNumber(summary.totalPayable, symbol)) });
  c.push({ appendBitmapText: alignLeftRight('Paid: ', formatNumber(summary.totalPayments, symbol)) });
  c.push({ appendBitmapText: alignLeftRight('Balance: ', formatNumber(Math.max(0, summary.balance), symbol)) });
  const changePayment = billPayments.find(p => p.isChange);
  if (changePayment) {
    c.push({ appendBitmapText: alignLeftRight('Change: ', formatNumber(Math.abs(changePayment.amount), symbol)) });
  }
  c.push(divider);

  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: alignCenter(`VAT: ${org.vat}`) });
  c.push({ appendBitmapText: ' ' });

  return receiptTempate(c, org);
};
