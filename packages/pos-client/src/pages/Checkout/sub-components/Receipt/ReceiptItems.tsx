import { Content, List, ActionSheet } from '../../../../core';
import React, { useState, useEffect, useRef } from 'react';
import { ItemsBreakdown } from './sub-components/ItemsBreakdown';
import { DiscountsBreakdown } from './sub-components/DiscountsBreakdown';
import { PaymentsBreakdown } from './sub-components/PaymentsBreakdown';
import { useDatabase } from '@nozbe/watermelondb/hooks';

interface ReceiptItemsProps {
  bill: any;
  readonly: boolean;
  billPayments: any;
  discountBreakdown: any;
  billItems: any;
  discounts: any[];
  billDiscounts: any;
  paymentTypes: any;
}

export const ReceiptItems: React.FC<ReceiptItemsProps> = ({
  bill,
  discounts,
  readonly,
  billItems,
  discountBreakdown,
  billPayments,
  billDiscounts,
  paymentTypes,
}) => {
  const refContentList = useRef();

  useEffect(() => refContentList.current._root.scrollToEnd(), [billItems]);

  const database = useDatabase();

  const [selected, setSelected] = useState(null);

  // PROGRESS: continue implementing remove on payents and discounts . unlike item - add a void function that doesnt soft delete
  const remove = async item => {
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
        remove(item);
      },
    );
  };

  const resolveBillDiscountId = fn => billDiscountId => {
    const billDiscount = billDiscounts.find(({ id }) => id === billDiscountId);
    billDiscount && fn(billDiscount);
  };

  const common = {
    readonly: readonly,
    selected,
    onSelect: onRemove,
  };

  return (
    <Content ref={refContentList}>
      <List style={{ paddingBottom: 60 }}>
        <ItemsBreakdown {...common} items={billItems} />
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
