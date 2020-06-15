import { Content, List, ActionSheet } from '../../../../core';
import React, { useEffect, useRef } from 'react';
import { ItemsBreakdown } from './sub-components/ItemsBreakdown';
import { DiscountsBreakdown } from './sub-components/DiscountsBreakdown';
import { PaymentsBreakdown } from './sub-components/PaymentsBreakdown';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import { Bill, BillPayment, BillItem, Discount, BillDiscount, PaymentType } from '../../../../models';
import { BillSummary } from '../../../../utils';

interface ReceiptItemsProps {
  readonly: boolean;
  billPayments: BillPayment[];
  discountBreakdown: BillSummary['discountBreakdown'];
  billItems: BillItem[];
  billDiscounts: BillDiscount[];
  paymentTypes: PaymentType[];
}

export const ReceiptItems: React.FC<ReceiptItemsProps> = ({
  readonly,
  billItems,
  discountBreakdown,
  billPayments,
  billDiscounts,
  paymentTypes,
}) => {
  const refContentList = useRef();

  useEffect(() => refContentList.current._root.scrollToEnd(), [billItems, billDiscounts, billPayments]);

  const remove = async (item: BillItem | BillPayment | BillDiscount) => {
    await item.void();
  };

  const removeNoPrint = async (item: BillItem) => {
    await item.voidNoPrint();
  };

  const makeComplimentary = async (item: BillItem) => {
    await item.makeComp();
  };

  const onRemoveBillItem = (item: BillItem) => {
    const options = ['Make complimentary', 'Remove', 'Force remove (no print)', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: item.itemName,
      },
      i => {
        const fns = [makeComplimentary, remove, removeNoPrint];
        i < fns.length && fns[i](item);
      },
    );
  };

  const onRemove = (item: BillDiscount | BillPayment) => {
    const options = ['Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: 'Options',
      },
      i => i < options.length && [remove][i](item),
    );
  };

  const resolveBillDiscount = fn => billDiscountId => {
    const billDiscount = billDiscounts.find(({ id }) => id === billDiscountId);
    billDiscount && fn(billDiscount);
  };

  return (
    <Content ref={refContentList}>
      <List style={{ paddingBottom: 60 }}>
        <ItemsBreakdown key="items_breakdown" readonly={readonly} onSelect={onRemoveBillItem} items={billItems} />
        <DiscountsBreakdown
          readonly={readonly}
          onSelect={resolveBillDiscount(onRemove)}
          discountBreakdown={discountBreakdown}
        />
        <PaymentsBreakdown
          readonly={readonly}
          onSelect={onRemove}
          payments={billPayments}
          paymentTypes={paymentTypes}
        />
      </List>
    </Content>
  );
};
