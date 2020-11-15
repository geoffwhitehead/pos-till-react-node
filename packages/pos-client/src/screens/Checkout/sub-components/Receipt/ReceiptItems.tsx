import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { ActionSheet, Content, List } from '../../../../core';
import { Bill, BillDiscount, BillItem, BillPayment, PaymentType, tableNames } from '../../../../models';
import { BillSummary } from '../../../../utils';
import { GRACE_PERIOD_MINUTES } from '../../../../utils/consts';
import { DiscountsBreakdown } from './sub-components/DiscountsBreakdown';
import { ItemsBreakdown } from './sub-components/ItemsBreakdown';
import { ModalReason, ModifyReason } from './sub-components/ModalReason';
import { PaymentsBreakdown } from './sub-components/PaymentsBreakdown';

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

  useEffect(() => {
    refContentList.current._root.scrollToEnd();
  }, [billItemsCount, billDiscounts, billPayments]);

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
        destructiveButtonIndex: 1,
        title: billItem.itemName,
      },
      index => {
        if (index === 0) {
          setRemoveMode(RemoveMode.comp);
          setSelectedBillItem(billItem);
        } else if (index === 1) {
          const endOfGracePeriod = dayjs(billItem.createdAt).add(GRACE_PERIOD_MINUTES, 'minute');
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
        destructiveButtonIndex: 0,
        title: 'Are you sure?',
      },
      index => {
        index === 0 && fn(item);
      },
    );
  };

  const onCloseReasonModalHandler = () => {
    setSelectedBillItem(null);
    setRemoveMode(null);
  };

  return (
    <Content ref={refContentList}>
      <List style={styles.receiptItems}>
        <ItemsBreakdown bill={bill} readonly={readonly} onSelect={billItemDialog} />
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
          title={capitalize(selectedBillItem?.itemName)}
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

const styles = {
  receiptItems: {
    paddingBottom: 60,
  },
};
