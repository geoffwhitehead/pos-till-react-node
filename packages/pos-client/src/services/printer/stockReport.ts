import { Database, Q } from '@nozbe/watermelondb';
import dayjs from 'dayjs';
import { Dictionary, groupBy } from 'lodash';
import { BillItem, Category, Organization, Printer, tableNames } from '../../models';
import { addHeader, alignCenter, alignLeftRight, starDivider } from './helpers';
import { receiptTempate } from './template';

type StockReportProps = {
  startDate: Date;
  endDate: Date;
  printer: Printer;
  organization: Organization;
  database: Database;
};

export const stockReport = async ({ startDate, endDate, printer, organization, database }: StockReportProps) => {
  const startDateUnix = dayjs(startDate)
    .startOf('day')
    .unix();

  const endDateUnix = dayjs(endDate)
    .endOf('day')
    .unix();

  const [billItems, categories] = await Promise.all([
    database.collections
      .get<BillItem>(tableNames.billItems)
      .query(
        Q.and(
          Q.where('is_voided', Q.notEq(true)),
          Q.where('created_at', Q.gte(startDateUnix)),
          Q.where('created_at', Q.lte(endDateUnix)),
        ),
      )
      .fetch(),
    database.collections
      .get<Category>(tableNames.categories)
      .query()
      .fetch(),
  ]);

  const groupedByCategory = groupBy(billItems, billItem => `${billItem.categoryId}-${billItem.categoryName}`);

  const groupedByCategoryAndItem = Object.entries(groupedByCategory).reduce((acc, [categoryId, categoryBillItems]) => {
    return {
      ...acc,
      [categoryId]: groupBy(categoryBillItems, billItem => billItem.itemId),
    };
  }, {} as Dictionary<Dictionary<BillItem[]>>);

  let c = [];

  c.push(starDivider(printer.printWidth));
  c.push({
    appendBitmapText: alignCenter('-- SALES STOCK REPORT --', printer.printWidth),
  });

  c.push({
    appendBitmapText: alignLeftRight(
      `Start Date: `,
      dayjs(startDate).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(printer.printWidth / 2),
    ),
  });

  c.push({
    appendBitmapText: alignLeftRight(
      `End Date: `,
      dayjs(endDate).format('DD/MM/YYYY HH:mm:ss'),
      Math.round(printer.printWidth / 2),
    ),
  });

  c.push(starDivider(printer.printWidth));

  Object.values(groupedByCategoryAndItem).map(categoryBillItems => {
    Object.values(categoryBillItems).map((billItems, i) => {
      if (i === 0) {
        addHeader(c, `Category: ${billItems[0].categoryName}`, printer.printWidth);
      }
      c.push({
        appendBitmapText: alignLeftRight(
          `${billItems[0].itemName}`,
          billItems.length.toString(),
          Math.round(printer.printWidth / 2),
        ),
      });
    });
  });

  return receiptTempate(c, organization, printer.printWidth);
};
