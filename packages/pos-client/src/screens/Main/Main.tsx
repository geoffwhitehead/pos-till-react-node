import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading/Loading';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { ReceiptPrinterContext } from '../../contexts/ReceiptPrinterContext';
import { database } from '../../database';
import { Bill, BillPeriod, Organization, PriceGroup, Printer, tableNames } from '../../models';
import { SidebarNavigator } from '../../navigators/SidebarNavigator';

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
  const [receiptPrinter, setReceiptPrinter] = useState<Printer>();
  const [_, setOrganization] = useState<Organization>();

  useEffect(() => {
    const fetchAndSetBillPeriod = async (organization: Organization) => {
      const currentBillPeriod = await organization.currentBillPeriod.fetch();
      setBillPeriod(currentBillPeriod);
    };
    const createAndSetNewBillPeriod = async (organization: Organization) => {
      await database.action(() => organization.createNewBillPeriod());
    };

    if (organization) {
      if (!organization.currentBillPeriodId) {
        createAndSetNewBillPeriod(organization);
      } else if (!billPeriod || billPeriod.id !== organization.currentBillPeriodId) {
        fetchAndSetBillPeriod(organization);
      }
    }
  }, [organization.currentBillPeriodId, billPeriod, setBillPeriod]);

  useEffect(() => {
    setOrganization(organization);
  }, [organization]);

  useEffect(() => {
    const setPrinter = async (receiptPrinterId: string) => {
      const printer = await database.collections.get<Printer>(tableNames.printers).find(receiptPrinterId);
      setReceiptPrinter(printer);
    };
    if (organization && organization.receiptPrinterId) {
      const { receiptPrinterId } = organization;

      const isDifferentPrinter = receiptPrinterId !== receiptPrinter?.id;
      if (isDifferentPrinter) {
        setPrinter(receiptPrinterId);
      }
    }
  }, [organization, receiptPrinter, setReceiptPrinter]);

  useEffect(() => {
    if (priceGroups && organization) {
      const defaultPriceGroup = priceGroups.find(({ id }) => id === organization.defaultPriceGroupId);
      const [firstPriceGroup] = priceGroups;

      setPriceGroup(defaultPriceGroup || firstPriceGroup || null);
    }
  }, [priceGroups, organization, setPriceGroup]);

  if (!billPeriod || !priceGroup || !organization) {
    return <Loading />;
  }
  return (
    <OrganizationContext.Provider value={{ organization, setOrganization }}>
      <BillPeriodContext.Provider value={{ billPeriod, setBillPeriod }}>
        <PriceGroupContext.Provider value={{ priceGroup, setPriceGroup }}>
          <CurrentBillContext.Provider value={{ currentBill, setCurrentBill }}>
            <ReceiptPrinterContext.Provider value={{ receiptPrinter, setReceiptPrinter }}>
              <SidebarNavigator />
            </ReceiptPrinterContext.Provider>
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
