import { Database } from '@nozbe/watermelondb';
import { useState, useEffect } from 'react';
import { sync } from '../../services/sync';
import { Loading } from '../Loading/Loading';
import React from 'react';
import { Organization, tableNames } from '../../models';
import withObservables from '@nozbe/with-observables';

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
    };
    checkSync();
  }, [database]);

  useEffect(() => {
    const hasSynced = organizations.some(o => o.id === organizationId);
    if (hasSynced) {
      setIsSyncDone(true);
    }
  }, [organizations]);

  if (isSyncDone) {
    return children;
  }

  return <Loading />;
};

export const Sync = withObservables<SyncOuterProps, SyncInnerProps>([], ({ database }) => ({
  organizations: database.collections.get<Organization>(tableNames.organizations).query(),
}))(SyncInner);
