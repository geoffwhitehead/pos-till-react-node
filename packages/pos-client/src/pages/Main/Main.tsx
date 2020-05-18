import React, { useState, useEffect } from 'react';
import { populate } from '../../services/populate';
import { SidebarNavigator } from '../../navigators';
import { Loading } from '../Loading/Loading';
import { useRealmQuery } from 'react-use-realm';
import { BillPeriodProps, BillPeriodSchema, PriceGroupProps, PriceGroupSchema } from '../../services/schemas';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid/v4';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { populateMelon } from './populateMelon';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Q } from '@nozbe/watermelondb';
import { tNames } from '../../models';
import { database } from '../../App';

// TODO: this needs to be moved to organizaiton => settings and queried from db
// const DEF_PRICE_GROUP_ID = '5e90eae405a18b11edbf3214';

export const MainWrapped: React.FC<{
  organizationId: string;
  userId: string;
  priceGroups: any;
  currentBillPeriod: any;
}> = ({ organizationId, userId, priceGroups, openPeriods }) => {
  // TODO: type
  // const billPeriods = useRealmQuery<BillPeriodProps>({ source: BillPeriodSchema.name, filter: 'closed = null' });
  // const priceGroups = useRealmQuery<PriceGroupProps>({ source: PriceGroupSchema.name });
  console.log('priceGroups', priceGroups);
  console.log('openPeriods', openPeriods);
  const [populating, setPopulating] = useState(false); // TODO debug: reset to true
  const [billPeriod, setBillPeriod] = useState(null);
  const [priceGroup, setPriceGroup] = useState(null);

  // console.log('----state- billPeriod', billPeriod);
  React.useEffect(() => {}, [setBillPeriod]);

  useEffect(() => {
    // const populateAsync = async () => {
    //   // TODO: use the dataId property to validate whether we need to re populate.
    //   try {
    //     await populate({ organizationId, userId });
    //     setPopulating(false);
    //   } catch (err) {
    //     console.log('Populating failed', err);
    //   }
    // };

    const melonTest = async () => {
      await populateMelon();
      setPopulating(false);
    };
    melonTest();
    // populateAsync();
  }, []);

  useEffect(() => {
    /**
     * If refreshing data in populate - make sure to only run after population is complete
     */

    if (!populating && openPeriods) {
      // switch (billPeriods.length) {
      //   case 0:
      //     return realm.write(() => {
      //       const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4(), opened: new Date() });
      //       setBillPeriod(newBillPeriod);
      //     });
      //   case 1:
      //     return setBillPeriod(billPeriods[0]);
      //   default:
      //     console.error('Invalid state: Multiple open bill periods');
      // }

      const setCurrentPeriod = async () => {
        if (openPeriods.length === 0) {
          const billPeriodCollection = database.collections.get(tNames.billPeriods);
          const newPeriod = await database.action(async () => await billPeriodCollection.create());
          console.log('------------period', newPeriod);
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
        <SidebarNavigator />
      </PriceGroupContext.Provider>
    </BillPeriodContext.Provider>
  );
};

export const Main = withDatabase(
  withObservables([], ({ database }) => ({
    priceGroups: database.collections
      .get('price_groups')
      .query()
      .observe(),
      openPeriods: database.collections
      .get('bill_periods')
      .query(Q.where('closed_at', Q.eq(null)))
      .observe(),
  }))(MainWrapped),
);
