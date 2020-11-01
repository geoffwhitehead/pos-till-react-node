import React, { useState, useEffect } from 'react';
import { SidebarNavigator } from '../../navigators/SidebarNavigator';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { Database } from '@nozbe/watermelondb';
import { tableNames, BillPeriod, PriceGroup, Bill, Organization } from '../../models';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { Loading } from '../../components/Loading/Loading';
import { OrganizationContext } from '../../contexts/OrganizationContext';

interface MainInnerProps {
  priceGroups: PriceGroup[];
  organization: Organization;
}

interface MainOuterProps {
  currentBillPeriod: BillPeriod;
  database: Database;
  organizationId: string;
  userId: string;
}

export const MainWrapped: React.FC<MainOuterProps & MainInnerProps> = ({ priceGroups, organization }) => {
  const [billPeriod, setBillPeriod] = useState<BillPeriod>();
  const [priceGroup, setPriceGroup] = useState<PriceGroup>();
  const [currentBill, setCurrentBill] = useState<Bill>();
  const [_, setOrganization] = useState<Organization>();

  useEffect(() => {
    const fetchAndSetBillPeriod = async (organization: Organization) => {
      const billPeriod = await organization.currentBillPeriod.fetch();
      setBillPeriod(billPeriod);
    };
    const createAndSetNewBillPeriod = async (organization: Organization) => organization.createNewBillPeriod();

    if (organization) {
      if (!organization.currentBillPeriodId) {
        createAndSetNewBillPeriod(organization);
      } else if (organization.currentBillPeriodId !== billPeriod?.id) {
        fetchAndSetBillPeriod(organization);
      }
    }

    setOrganization(organization);
  }, [organization, billPeriod, setBillPeriod]);

  useEffect(() => {
    if (priceGroups && organization) {
      const defaultPriceGroup = priceGroups.find(({ id }) => id === organization.defaultPriceGroupId);
      const [firstPriceGroup] = priceGroups;

      setPriceGroup(defaultPriceGroup || firstPriceGroup || null);
    }
  }, [priceGroups, organization]);

  if (!billPeriod || !priceGroup || !organization) {
    return <Loading />;
  }
  return (
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
  withObservables<MainOuterProps, MainInnerProps>([], ({ database, organizationId }) => ({
    priceGroups: database.collections.get<PriceGroup>(tableNames.priceGroups).query(),
    organization: database.collections.get<Organization>(tableNames.organizations).findAndObserve(organizationId),
  }))(MainWrapped),
);
