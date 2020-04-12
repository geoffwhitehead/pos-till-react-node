import React, { useContext, useState } from 'react';
import { Toast, Container, Grid, Col } from '../../core';
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader';
import {
  BillPeriodSchema,
  BillProps,
  BillSchema,
  BillPeriodProps,
  CategoryProps,
  CategorySchema,
  DiscountProps,
  DiscountSchema,
  PaymentTypeProps,
  PaymentTypeSchema,
} from '../../services/schemas';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { realm } from '../../services/Realm';
import { Protected } from './Protected';
import { useRealmQuery } from 'react-use-realm';
import { periodReport } from '../../services/printer/periodReport';
import { ReportsList } from './sub-components/ReportsList/ReportsList';
import { ReportReceipt } from './sub-components/ReportReceipt/ReportReceipt';
import { print } from '../../services/printer/printer';
import uuidv4 from 'uuid';

const ORG_PASSCODE = '1234'; // TODO: move to an org setting and hash

export const Reports = ({ navigation }) => {
  const openDrawer = () => navigation.openDrawer();
  const billPeriods = useRealmQuery<BillPeriodProps>({
    source: BillPeriodSchema.name,
    sort: [['opened', true]],
  });
  const categories = useRealmQuery<CategoryProps>({ source: CategorySchema.name });
  const discounts = useRealmQuery<DiscountProps>({ source: DiscountSchema.name });
  const paymentTypes = useRealmQuery<PaymentTypeProps>({ source: PaymentTypeSchema.name });
  const allBills = useRealmQuery<BillProps>({
    source: BillSchema.name,
  });

  const [selectedBillPeriod, setSelectedBillPeriod] = useState<BillPeriodProps | null>();

  // TODO: REACT CANT DIF REALM OBJECTS
  // const onPrint = useCallback(() => {
  const onPrint = () => {
    const periodBills = allBills.filtered('billPeriod._id = $0', selectedBillPeriod._id);
    const commands = periodReport(selectedBillPeriod, periodBills, categories, discounts, paymentTypes);
    print(commands);
  };
  // }, [allBills, categories, discounts, paymentTypes]);

  const { billPeriod, setBillPeriod } = useContext(BillPeriodContext);

  const closeCurrentPeriod: () => void = () => {
    const openBills = allBills.filtered('isClosed = false');
    if (openBills.length > 0) {
      Toast.show({
        text: `There are currently ${openBills.length} open bills, please close these first.`,
        buttonText: 'Okay',
        duration: 5000,
      });
    } else {
      realm.write(() => {
        billPeriod.closed = new Date();
        const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4(), opened: new Date() });
        setBillPeriod(newBillPeriod);
      });
      onPrint();
    }
  };

  return (
    <Container>
      <SidebarHeader title="Reports" onOpen={openDrawer} />
      <Protected code={ORG_PASSCODE} navigation={navigation}>
        <Grid>
          <Col>
            <ReportsList
              reports={billPeriods}
              selectedReport={selectedBillPeriod}
              onSelectReport={report => setSelectedBillPeriod(report)}
              onPressClosePeriod={closeCurrentPeriod}
            />
          </Col>
          {selectedBillPeriod && (
            <ReportReceipt
              billPeriod={selectedBillPeriod}
              bills={allBills.filtered('billPeriod._id = $0', selectedBillPeriod._id)}
              categories={categories}
              paymentTypes={paymentTypes}
              discounts={discounts}
              onPressPrint={onPrint}
            />
          )}
        </Grid>
      </Protected>
    </Container>
  );
};
