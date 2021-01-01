import { capitalize, groupBy } from 'lodash';
import {
  BillDiscount,
  BillItem,
  BillPayment,
  Discount,
  Organization,
  PaymentType,
  PriceGroup,
  Printer,
} from '../../models';
import { billSummary, BillSummary, formatNumber, getItemPrice, getModifierItemPrice } from '../../utils';
import { addHeader, alignCenter, alignLeftRight, alignRight, divider } from './helpers';
import { receiptTempate } from './template';

const modPrefix = ' -';

export const receiptBill = async (
  billItems: BillItem[],
  billDiscounts: BillDiscount[],
  billPayments: BillPayment[],
  discounts: Discount[],
  priceGroups: PriceGroup[],
  paymentTypes: PaymentType[],
  printer: Printer,
  organization: Organization,
) => {
  const { currency, vat } = organization;

  const printItemsGroup = (group: BillSummary['itemsBreakdown']) => {
    group.map(({ item, mods, total }) => {
      c.push({
        appendBitmapText: alignLeftRight(
          capitalize(item.itemName),
          formatNumber(getItemPrice(item), currency),
          printer.printWidth,
        ),
      });
      mods.map(mod => {
        c.push({
          appendBitmapText: alignLeftRight(
            `${modPrefix} ${capitalize(mod.modifierItemName)}`,
            formatNumber(getModifierItemPrice(mod), currency),
            printer.printWidth,
          ),
        });
      });
    });
  };

  const summary = await billSummary(billItems, billDiscounts, billPayments, discounts);

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

    const stdGroup = group.filter(({ item }) => !item.isComp);

    printItemsGroup(stdGroup);
  });

  c.push({ appendBitmapText: alignRight(`Total: ${formatNumber(summary.total, currency)}`, printer.printWidth) });

  const compItems = summary.itemsBreakdown.filter(({ item }) => item.isComp);
  compItems.length && addHeader(c, 'Complimentary Items', printer.printWidth);
  printItemsGroup(compItems);

  billDiscounts.length > 0 && addHeader(c, 'Discounts', printer.printWidth);

  summary.discountBreakdown.map(discount => {
    c.push({
      appendBitmapText: alignLeftRight(
        capitalize(discount.name),
        `-${formatNumber(discount.calculatedDiscount, currency)}`,
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
        appendBitmapText: alignLeftRight(
          capitalize(pT.name),
          formatNumber(payment.amount, currency),
          printer.printWidth,
        ),
      });
    });

  addHeader(c, 'Totals', printer.printWidth);
  c.push({
    appendBitmapText: alignLeftRight('Subtotal: ', formatNumber(summary.total, currency), printer.printWidth),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Total Discount: ',
      formatNumber(summary.totalDiscount, currency),
      printer.printWidth,
    ),
  });
  c.push({
    appendBitmapText: alignLeftRight('Total: ', formatNumber(summary.totalPayable, currency), printer.printWidth),
  });
  c.push({
    appendBitmapText: alignLeftRight('Paid: ', formatNumber(summary.totalPayments, currency), printer.printWidth),
  });
  c.push({
    appendBitmapText: alignLeftRight(
      'Balance: ',
      formatNumber(Math.max(0, summary.balance), currency),
      printer.printWidth,
    ),
  });
  const changePayment = billPayments.find(p => p.isChange);
  if (changePayment) {
    c.push({
      appendBitmapText: alignLeftRight(
        'Change: ',
        formatNumber(Math.abs(changePayment.amount), currency),
        printer.printWidth,
      ),
    });
  }
  c.push(divider(printer.printWidth));

  c.push({ appendBitmapText: ' ' });
  c.push({ appendBitmapText: alignCenter(`VAT: ${vat}`, printer.printWidth) });
  c.push({ appendBitmapText: ' ' });

  return receiptTempate(c, organization, printer.printWidth);
};
