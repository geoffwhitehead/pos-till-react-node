import React, { useState, useEffect } from 'react';
import { SidebarNavigator } from '../../navigators/SidebarNavigator';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { populate } from './populate';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Q, Database } from '@nozbe/watermelondb';
import { tableNames, BillPeriod, PriceGroup, Bill } from '../../models';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { Loading } from '../../components/Loading/Loading';

interface MainInnerProps {
  priceGroups: any; // TODO: fix type
  openPeriods: any;
}

interface MainOuterProps {
  organizationId: string;
  userId: string;
  currentBillPeriod: BillPeriod;
  database: Database;
}

export const MainWrapped: React.FC<MainOuterProps & MainInnerProps> = ({
  organizationId,
  userId,
  priceGroups,
  openPeriods,
  database,
}) => {
  const [populating, setPopulating] = useState(false); // TODO debug: reset to true
  const [billPeriod, setBillPeriod] = useState<BillPeriod>(null);
  const [priceGroup, setPriceGroup] = useState<PriceGroup>(null);
  const [currentBill, setCurrentBill] = useState<Bill>(null);

  React.useEffect(() => {}, [setBillPeriod]);

  useEffect(() => {
    const populateAsync = async () => {
      // TODO: SYNC.
      try {
        console.log('database', database);
        await populate(database);
        setPopulating(false);
      } catch (err) {
        console.log('Populating failed', err);
      }
    };

    populateAsync();
  }, []);

  useEffect(() => {
    /**
     * If refreshing data in populate - make sure to only run after population is complete
     */

    if (!populating && openPeriods) {
      const setCurrentPeriod = async () => {
        if (openPeriods.length === 0) {
          console.log('tableNames', tableNames);
          const billPeriodCollection = database.collections.get<BillPeriod>(tableNames.billPeriods);
          const newPeriod = await database.action<BillPeriod>(async () => await billPeriodCollection.create());
          setBillPeriod(newPeriod);
        } else {
          setBillPeriod(openPeriods[0]);
        }
      };
      setCurrentPeriod();
    }
  }, [setBillPeriod, populating, openPeriods]);

  useEffect(() => {
    if (priceGroups && !populating) {
      setPriceGroup(priceGroups[0]); // TODO: use first price group - need to change this to use default flag
    }
  }, [priceGroups, populating]);

  return populating || !billPeriod || !priceGroup ? (
    <Loading />
  ) : (
    <BillPeriodContext.Provider value={{ billPeriod, setBillPeriod }}>
      <PriceGroupContext.Provider value={{ priceGroup, setPriceGroup }}>
        <CurrentBillContext.Provider value={{ currentBill, setCurrentBill }}>
          <SidebarNavigator />
        </CurrentBillContext.Provider>
      </PriceGroupContext.Provider>
    </BillPeriodContext.Provider>
  );
};

export const Main = withDatabase<any>(
  withObservables<MainOuterProps, MainInnerProps>([], ({ database }) => ({
    priceGroups: database.collections
      .get<PriceGroup>(tableNames.priceGroups)
      .query()
      .observe(),
    openPeriods: database.collections
      .get<BillPeriod>(tableNames.billPeriods)
      .query(Q.where('closed_at', Q.eq(null)))
      .observe(),
  }))(MainWrapped),
);
