import React, { useState, useEffect } from 'react';
import { SidebarNavigator } from '../../navigators/SidebarNavigator';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { populate } from './populate';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Q, Database } from '@nozbe/watermelondb';
import { tableNames, BillPeriod, PriceGroup, Bill, Organization } from '../../models';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { Loading } from '../../components/Loading/Loading';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { getOrganization } from '../../api/organization';
import { okResponse } from '../../api';

interface MainInnerProps {
  priceGroups: any; // TODO: fix type
  openPeriods: any;
  organizations: any;
}

interface MainOuterProps {
  // organizationId: string;
  // userId: string;
  currentBillPeriod: BillPeriod;
  database: Database;
}

export const MainWrapped: React.FC<MainOuterProps & MainInnerProps> = ({
  // organizationId,
  // userId,
  priceGroups,
  openPeriods,
  database,
  organizations,
}) => {
  const [syncDone, setSyncDone] = useState(false); // TODO debug: reset to true
  const [billPeriod, setBillPeriod] = useState<BillPeriod>();
  const [priceGroup, setPriceGroup] = useState<PriceGroup>();
  const [currentBill, setCurrentBill] = useState<Bill>();
  const [organization, setOrganization] = useState<Organization>();

  console.log('syncDone', syncDone);
  // console.log('billPeriod', billPeriod);
  // console.log('priceGroup', priceGroup);
  // console.log('organization', organization);
  // console.log('priceGroups', priceGroups);

  useEffect(() => {
    const checkSync = async () => {
      console.log('checking sync');
      try {
        const organizations = await database.collections
          .get<Organization>(tableNames.organizations)
          .query()
          .fetch();

        if (organizations.length === 0) {
          await populate(database);
        } else {
          const dbOrg = organizations[0];
          const serverOrg = okResponse(await getOrganization());
          console.log('dbOrg', dbOrg);
          console.log('serverOrg', serverOrg);
          if (serverOrg && serverOrg.syncId !== dbOrg.syncId) {
            await populate(database);
          } else {
            console.log('matching sync id');
          }
        }
      } catch (e) {
        console.error(e);
      }
      setSyncDone(true);
    };

    checkSync();
  }, []);

  useEffect(() => {
    if (organizations.length > 0) {
      setOrganization(organizations[0]);
    }
  }, [organizations, syncDone]);

  useEffect(() => {
    /**
     * If refreshing data in populate - make sure to only run after population is complete
     */

    if (syncDone && openPeriods) {
      const setCurrentPeriod = async () => {
        if (openPeriods.length === 0) {
          const billPeriodCollection = database.collections.get<BillPeriod>(tableNames.billPeriods);
          const newPeriod = await database.action<BillPeriod>(async () => await billPeriodCollection.create());
          setBillPeriod(newPeriod);
        } else {
          setBillPeriod(openPeriods[0]);
        }
      };
      setCurrentPeriod();
    }
  }, [setBillPeriod, syncDone, openPeriods]);

  useEffect(() => {
    if (priceGroups && organization && syncDone) {
      const pG = priceGroups.find(pg => pg.id === organization.defaultPriceGroupId);
      setPriceGroup(pG || priceGroups[0]); // TODO: use first price group - need to change this to use default flag
    }
  }, [priceGroups, syncDone, organization]);

  return !syncDone || !billPeriod || !priceGroup || !organization ? (
    <Loading />
  ) : (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      <BillPeriodContext.Provider value={{ billPeriod, setBillPeriod }}>
        <PriceGroupContext.Provider value={{ priceGroup, setPriceGroup }}>
          <CurrentBillContext.Provider value={{ currentBill, setCurrentBill }}>
            <SidebarNavigator />
          </CurrentBillContext.Provider>
        </PriceGroupContext.Provider>
      </BillPeriodContext.Provider>
    </OrganizationContext.Provider>
  );
};

export const Main = withDatabase<any>(
  withObservables<MainOuterProps, MainInnerProps>([], ({ database }) => ({
    priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    openPeriods: database.collections.get<BillPeriod>(tableNames.billPeriods).query(Q.where('closed_at', Q.eq(null))),
    organizations: database.collections.get<Organization>(tableNames.organizations).query(),
  }))(MainWrapped),
);
