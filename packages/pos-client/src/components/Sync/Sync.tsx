import { Database } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import React, { useEffect, useState } from 'react';
import { Organization, tableNames } from '../../models';
import { sync } from '../../services/sync';
import { Loading } from '../Loading/Loading';

type SyncOuterProps = {
  database: Database;
  organizationId: string;
};

type SyncInnerProps = {
  organizations: Organization[];
};

export const SyncInner: React.FC<SyncOuterProps & SyncInnerProps> = ({
  database,
  children,
  organizationId,
  organizations = [],
}) => {
  const [isSyncDone, setIsSyncDone] = useState(false); // TODO debug: reset to true

  useEffect(() => {
    const checkSync = async () => {
      try {
        await sync(database);
      } catch (e) {
        console.error(e);
      }
      setIsSyncDone(true);
    };
    checkSync();
  }, [database]);

  const hasOrganization = organizations.some(o => o.id === organizationId);

  console.log('isSyncDone', isSyncDone);
  console.log('hasOrganization', hasOrganization);
  if (!isSyncDone || !hasOrganization) {
    return <Loading />;
  }
  return children;
};

export const Sync = withObservables<SyncOuterProps, SyncInnerProps>([], ({ database }) => ({
  organizations: database.collections.get<Organization>(tableNames.organizations).query(),
}))(SyncInner);
