import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import { useDatabase } from '@nozbe/watermelondb/hooks';
import withObservables from '@nozbe/with-observables';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { capitalize } from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import * as Yup from 'yup';
import { ItemField } from '../../../../components/ItemField/ItemField';
import { Modal } from '../../../../components/Modal/Modal';
import { ModalContentButton } from '../../../../components/Modal/ModalContentButton';
import { OrganizationContext } from '../../../../contexts/OrganizationContext';
import { ActionSheet, Content, Form, Input, List } from '../../../../core';
import { Bill, BillDiscount, BillItem, BillPayment, PaymentType, tableNames } from '../../../../models';
import { BillSummary } from '../../../../utils';
import { moderateScale } from '../../../../utils/scaling';
import { BillCalls } from './sub-components/BillCalls';
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

export enum Action {
  void = 'void',
  comp = 'comp',
  message = 'message',
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
  const [action, setAction] = useState<Action>();
  const { organization } = useContext(OrganizationContext);
  const [printMessage, setPrintMessage] = useState('');

  useEffect(() => {
    refContentList.current._root.scrollToEnd();
  }, [billItemsCount, billDiscounts, billPayments]);

  useEffect(() => {}, [selectedBillItem]);

  const onRemoveBillItem = async (billItem: BillItem, values?: ModifyReason) => {
    await database.action(() => billItem.void(values));
    onCloseModalHandler();
  };

  const onRemoveBillDiscount = async (billDiscount: BillDiscount) => database.action(() => billDiscount.void());
  const onRemoveBillPayment = async (billPayment: BillPayment) => database.action(() => billPayment.void());

  // const removeNoPrint = async (item: BillItem) => {
  //   await database.action(() => item.voidNoPrint());
  // };

  const onMakeComplimentary = async (billItem: BillItem, values: ModifyReason) => {
    await database.action(() => billItem.makeComp(values));
    onCloseModalHandler();
  };

  const addPrintMessage = async values => {
    await database.action(() => selectedBillItem.update(record => Object.assign(record, values)));
    onCloseModalHandler();
  };

  const billItemDialog = (billItem: BillItem) => {
    const options = ['Add Message', 'Make complimentary', 'Remove', 'Cancel'];
    ActionSheet.show(
      {
        options,
        destructiveButtonIndex: 2,
        title: billItem.itemName,
      },
      index => {
        if (index === 0) {
          setSelectedBillItem(billItem);
          setAction(Action.message);
        } else if (index === 1) {
          setAction(Action.comp);
          setSelectedBillItem(billItem);
        } else if (index === 2) {
          const endOfGracePeriod = dayjs(billItem.createdAt).add(organization.gracePeriodMinutes, 'minute');
          const hasGracePeriodExpired = dayjs().isAfter(endOfGracePeriod);
          if (hasGracePeriodExpired) {
            setAction(Action.void);
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

  const onCloseModalHandler = () => {
    setSelectedBillItem(null);
    setAction(null);
  };

  const isReasonModalOpen = !!selectedBillItem && (action === Action.comp || action === Action.void);
  const isPrintMessageModalOpen = !!selectedBillItem && action === Action.message;

  return (
    <Content ref={refContentList}>
      <List style={styles.receiptItems}>
        <BillCalls bill={bill} />
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
      <Modal style={{ width: 500 }} onClose={onCloseModalHandler} isOpen={isReasonModalOpen}>
        <ModalReason
          onClose={onCloseModalHandler}
          onComplete={values => {
            if (action === Action.void) {
              onRemoveBillItem(selectedBillItem, values);
            }
            if (action === Action.comp) {
              onMakeComplimentary(selectedBillItem, values);
            }
          }}
          mode={action}
          title={capitalize(selectedBillItem?.itemName)}
        />
      </Modal>
      <Modal style={{ width: 500 }} onClose={onCloseModalHandler} isOpen={isPrintMessageModalOpen}>
        <Formik
          initialValues={{ printMessage }}
          validationSchema={Yup.object().shape({
            printMessage: Yup.string()
              .min(1, 'Too Short')
              .max(30, 'Too Long')
              .required('Required'),
          })}
          onSubmit={addPrintMessage}
        >
          {({ handleChange, handleBlur, handleSubmit, errors, touched, values }) => {
            const { printMessage } = values;

            return (
              <ModalContentButton
                onPressPrimaryButton={handleSubmit}
                onPressSecondaryButton={onCloseModalHandler}
                secondaryButtonText="Cancel"
                primaryButtonText="Save"
                title={`${selectedBillItem.itemName}: Add a print message`}
                size="small"
              >
                <Form>
                  <ItemField
                    label="Print Message"
                    touched={touched.printMessage as boolean}
                    name="printMessage"
                    errors={errors.printMessage}
                  >
                    <Input
                      onChangeText={handleChange('printMessage')}
                      onBlur={handleBlur('printMessage')}
                      value={printMessage}
                    />
                  </ItemField>
                </Form>
              </ModalContentButton>
            );
          }}
        </Formik>
      </Modal>
    </Content>
  );
};

const enhance = component =>
  withDatabase(
    withObservables<ReceiptItemsOuterProps, ReceiptItemsInnerProps>(
      ['bill', 'billPayments', 'billDiscounts'],
      ({ bill, database }) => ({
        bill,
        billItemsCount: bill.billItems.observeCount(),
        paymentTypes: database.collections.get<PaymentType>(tableNames.paymentTypes).query(),
      }),
    )(component),
  );

export const ReceiptItems = enhance(ReceiptItemsInner);

const styles = StyleSheet.create({
  receiptItems: {
    paddingBottom: moderateScale(60),
  },
});
