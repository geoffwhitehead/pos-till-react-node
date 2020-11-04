import { Content, List, ActionSheet } from '../../../../core';
import React, { useEffect, useRef, useState } from 'react';
import { ItemsBreakdown } from './sub-components/ItemsBreakdown';
import { DiscountsBreakdown } from './sub-components/DiscountsBreakdown';
import { PaymentsBreakdown } from './sub-components/PaymentsBreakdown';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import {
  Bill,
  BillPayment,
  BillItem,
  Discount,
  BillDiscount,
  PaymentType,
  PriceGroup,
  tableNames,
} from '../../../../models';
import { BillSummary } from '../../../../utils';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Modal } from '../../../../components/Modal/Modal';
import { ModalReason, ModifyReason } from './sub-components/ModalReason';
import dayjs from 'dayjs';
import { find } from 'lodash';
import { Database } from '@nozbe/watermelondb';

type ReceiptItemsOuterProps = {
  readonly: boolean;
  billPayments: BillPayment[];
  discountBreakdown: BillSummary['discountBreakdown'];
  billDiscounts: BillDiscount[];
  bill: Bill;
  database: Database;
};

type ReceiptItemsInnerProps = {
  billItemsCount: number;
  paymentTypes: PaymentType[];
};

export enum RemoveMode {
  void = 'void',
  comp = 'comp',
}

export const ReceiptItemsInner: React.FC<ReceiptItemsOuterProps & ReceiptItemsInnerProps> = ({
  readonly,
  billItemsCount,
  discountBreakdown,
  billPayments,
  billDiscounts,
  paymentTypes,
  bill,
}) => {
  const refContentList = useRef();
  const database = useDatabase();
  const [selectedBillItem, setSelectedBillItem] = useState<BillItem>();
  const [removeMode, setRemoveMode] = useState<RemoveMode>();

  useEffect(() => refContentList.current._root.scrollToEnd(), [billItemsCount, billDiscounts, billPayments]);

  useEffect(() => {}, [selectedBillItem]);

  const onRemoveBillItem = async (billItem: BillItem, values?: ModifyReason) => {
    await database.action(() => billItem.void(values));
    setSelectedBillItem(null);
    setRemoveMode(null);
  };

  const onRemoveBillDiscount = async (billDiscount: BillDiscount) => database.action(() => billDiscount.void());
  const onRemoveBillPayment = async (billPayment: BillPayment) => database.action(() => billPayment.void());

  // const removeNoPrint = async (item: BillItem) => {
  //   await database.action(() => item.voidNoPrint());
  // };

  const onMakeComplimentary = async (billItem: BillItem, values: ModifyReason) => {
    await database.action(() => billItem.makeComp(values));
    setSelectedBillItem(null);
    setRemoveMode(null);
  };

  const billItemDialog = (billItem: BillItem) => {
    const options = ['Make complimentary', 'Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: 2,
        title: billItem.itemName,
      },
      index => {
        if (index === 0) {
          setRemoveMode(RemoveMode.comp);
          setSelectedBillItem(billItem);
        } else {
          const endOfGracePeriod = dayjs(billItem.createdAt).add(5, 'minute');
          const hasGracePeriodExpired = dayjs().isAfter(endOfGracePeriod);
          if (hasGracePeriodExpired) {
            setRemoveMode(RemoveMode.void);
            setSelectedBillItem(billItem);
          } else {
            onRemoveBillItem(billItem);
          }
        }
      },
    );
  };

  const areYouSureDialog = (item: BillPayment | BillDiscount, fn: (item: BillPayment | BillDiscount) => void) => {
    const options = ['Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: 1,
        title: 'Options',
      },
      () => {
        fn(item);
      },
    );
  };

  const onCloseReasonModalHandler = () => {
    setSelectedBillItem(null);
    setRemoveMode(null);
  };

  return (
    <Content ref={refContentList}>
      <List style={{ paddingBottom: 60 }}>
        <ItemsBreakdown bill={bill} key="items_breakdown" readonly={readonly} onSelect={billItemDialog} />
        <DiscountsBreakdown
          readonly={readonly}
          discountBreakdown={discountBreakdown}
          onSelect={billDiscount => areYouSureDialog(billDiscount, onRemoveBillDiscount)}
          billDiscounts={billDiscounts}
        />
        <PaymentsBreakdown
          readonly={readonly}
          onSelect={billPayment => areYouSureDialog(billPayment, onRemoveBillPayment)}
          payments={billPayments}
          paymentTypes={paymentTypes}
        />
      </List>
      <Modal
        style={{ width: 600, height: '60%' }}
        onClose={onCloseReasonModalHandler}
        isOpen={!!selectedBillItem && !!removeMode}
      >
        <ModalReason
          onClose={onCloseReasonModalHandler}
          onComplete={values => {
            if (removeMode === RemoveMode.void) {
              onRemoveBillItem(selectedBillItem, values);
            }
            if (removeMode === RemoveMode.comp) {
              onMakeComplimentary(selectedBillItem, values);
            }
          }}
          mode={removeMode}
        />
      </Modal>
    </Content>
  );
};

const enhance = component =>
  withDatabase(
    withObservables<ReceiptItemsOuterProps, ReceiptItemsInnerProps>(['bill'], ({ bill, database }) => ({
      bill,
      billItemsCount: bill.billItems.observeCount(),
      paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
    }))(component),
  );

export const ReceiptItems = enhance(ReceiptItemsInner);
