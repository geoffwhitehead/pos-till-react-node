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

  const database = useDatabase();

  const remove = async (item: BillItem) => {
    await database.action(() => item.void());
  };

  const onRemove = item => {
    const options = ['Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: 'Select option',
      },
      i => {
        i === 0 && remove(item);
      },
    );
  };

  const resolveBillDiscountId = fn => billDiscountId => {
    const billDiscount = billDiscounts.find(({ id }) => id === billDiscountId);
    billDiscount && fn(billDiscount);
  };

  const common = {
    readonly: readonly,
    onSelect: onRemove,
  };

  return (
    <Content ref={refContentList}>
      <List style={{ paddingBottom: 60 }}>
        <ItemsBreakdown key="items_breakdown" {...common} items={billItems} />
        <DiscountsBreakdown
          {...common}
          onSelect={resolveBillDiscountId(onRemove)}
          discountBreakdown={discountBreakdown}
        />
        <PaymentsBreakdown {...common} payments={billPayments} paymentTypes={paymentTypes} />
      </List>
    </Content>
  );
};
