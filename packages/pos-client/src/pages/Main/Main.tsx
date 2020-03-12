import React, { useState, useEffect } from 'react';
import { populate } from '../../services/populate';
import { SidebarNavigator } from '../../navigators';
import { Loading } from '../Loading/Loading';
import { useRealmQuery } from 'react-use-realm';
import { BillPeriodProps, BillPeriodSchema } from '../../services/schemas';
import { realm } from '../../services/Realm';
import uuidv4 from 'uuid/v4';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';

export const Main: React.FC = () => {
  const [populating, setPopulating] = useState(true);
  const billPeriods = useRealmQuery<BillPeriodProps>({ source: BillPeriodSchema.name, filter: 'closed = null' });
  const [billPeriod, setBillPeriod] = useState(null);

  useEffect(() => {
    const populateAsync = async () => {
      // TODO: use the dataId property to validate whether we need to re populate.
      try {
        await populate();
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

  return populating || !billPeriod ? (
    <Loading />
  ) : (
    <BillPeriodContext.Provider value={{ billPeriod, setBillPeriod }}>
      <SidebarNavigator />
    </BillPeriodContext.Provider>
  );
};
