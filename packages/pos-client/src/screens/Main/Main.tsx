import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Loading } from '../../components/Loading/Loading';
import { BillPeriodContext } from '../../contexts/BillPeriodContext';
import { CurrentBillContext } from '../../contexts/CurrentBillContext';
import { LastSyncedAtContext } from '../../contexts/LastSyncedAtContext';
import { OrganizationContext } from '../../contexts/OrganizationContext';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { ReceiptPrinterContext } from '../../contexts/ReceiptPrinterContext';
import { RecentColorsContext, RecentColorsType } from '../../contexts/RecentColorsContext';
import { database } from '../../database';
import { useSync } from '../../hooks/useSync';
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
  const [recentColors, setRecentColors] = useState<RecentColorsType>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<Dayjs>();
  const [_, setOrganization] = useState<Organization>();
  const [minutes, setMinutes] = useState(0);
  const [__, doSync] = useSync();

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(minutes => minutes + 1);
    }, 1000 * 60 * 60 * 4); // every 4 hours
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    doSync();

    // TODO: understand why its necessary to call this manually. Is it because doSync is called from outside of the nested context provider?
    setLastSyncedAt(dayjs());
  }, [minutes]);

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

      // TODO: replace this with seeding organization correctly
      const createDefaultPriceGroup = async () =>
        await database.action(() =>
          database.collections
            .get<PriceGroup>(tableNames.priceGroups)
            .create(record =>
              Object.assign(record, { name: 'Default', shortName: 'Default', isPrepTimeRequired: false }),
            ),
        );

      if (!firstPriceGroup) {
        createDefaultPriceGroup();
      }

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
              <RecentColorsContext.Provider value={{ recentColors, setRecentColors }}>
                <LastSyncedAtContext.Provider value={{ lastSyncedAt, setLastSyncedAt }}>
                  <SidebarNavigator />
                </LastSyncedAtContext.Provider>
              </RecentColorsContext.Provider>
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
