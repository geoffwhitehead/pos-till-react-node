import React, { useState, useEffect } from 'react';
import { SidebarNavigator } from '../../navigators';
import { Loading } from '../Loading/Loading';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { populateMelon } from './populateMelon';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { tableNames } from '../../models';
import { database } from '../../App';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import dayjs from 'dayjs';

export const MainWrapped: React.FC<{
  organizationId: string;
  userId: string;
  priceGroups: any;
  currentBillPeriod: any;
  openPeriods: any;
}> = ({ organizationId, userId, priceGroups, openPeriods }) => {
  // TODO: type
  const [populating, setPopulating] = useState(false); // TODO debug: reset to true
  const [billPeriod, setBillPeriod] = useState(null);
  const [priceGroup, setPriceGroup] = useState(null);
  const [currentBill, setCurrentBill] = useState(null);

  React.useEffect(() => {}, [setBillPeriod]);

  useEffect(() => {
    const populateAsync = async () => {
      // TODO: SYNC.
      try {
        await populateMelon();
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
          const billPeriodCollection = database.collections.get(tableNames.billPeriods);
          const newPeriod = await database.action(async () => await billPeriodCollection.create());
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

  const d = dayjs().unix();

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
  withObservables<any, any>([], ({ database }) => ({
    priceGroups: database.collections
      .get(tableNames.priceGroups)
      .query()
      .observe(),
    openPeriods: database.collections
      .get(tableNames.billPeriods)
      .query(Q.where('closed_at', Q.eq(null)))
      .observe(),
  }))(MainWrapped),
);
