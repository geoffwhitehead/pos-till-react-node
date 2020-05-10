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

// TODO: this needs to be moved to organizaiton => settings and queried from db
// const DEF_PRICE_GROUP_ID = '5e90eae405a18b11edbf3214';

export const Main: React.FC<{ organizationId: string; userId: string }> = ({ organizationId, userId }) => {
  const billPeriods = useRealmQuery<BillPeriodProps>({ source: BillPeriodSchema.name, filter: 'closed = null' });
  const priceGroups = useRealmQuery<PriceGroupProps>({ source: PriceGroupSchema.name });

  const [populating, setPopulating] = useState(true);
  const [billPeriod, setBillPeriod] = useState(null);
  const [priceGroup, setPriceGroup] = useState(null);

  useEffect(() => {
    const populateAsync = async () => {
      // TODO: use the dataId property to validate whether we need to re populate.
      try {
        await populate({ organizationId, userId });
        setPopulating(false);
      } catch (err) {
        console.log('Populating failed', err);
      }
    };

    populateAsync();
    populateMelon();
  }, []);

  useEffect(() => {
    /**
     * If refreshing data in populate - make sure to only run after population is complete
     */

    if (billPeriods && !populating) {
      switch (billPeriods.length) {
        case 0:
          return realm.write(() => {
            const newBillPeriod = realm.create(BillPeriodSchema.name, { _id: uuidv4(), opened: new Date() });
            setBillPeriod(newBillPeriod);
          });
        case 1:
          return setBillPeriod(billPeriods[0]);
        default:
          console.error('Invalid state: Multiple open bill periods');
      }
    }
  }, [billPeriods, populating]);

  useEffect(() => {
    if (priceGroups && !populating) {
      console.log('----- priceGroups', priceGroups);
      priceGroups.map(pg => console.log('pg', pg));
      setPriceGroup(priceGroups[0]); // TODO: use first price group - need to change this to use default flag
    }
  }, [priceGroups, populating]);

  console.log('***********');
  console.log('populating', populating);
  console.log('billPeriod', billPeriod);
  console.log('priceGroup', priceGroup);
  console.log('***********');

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
