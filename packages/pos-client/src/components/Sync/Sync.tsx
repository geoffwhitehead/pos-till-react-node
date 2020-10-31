import { Database } from '@nozbe/watermelondb';
import { useState, useEffect } from 'react';
import { sync } from '../../services/sync';
import { Loading } from '../Loading/Loading';
import React from 'react';

export const Sync: React.FC<{ database: Database }> = ({ database, children }) => {
  const [isSyncDone, setIsSyncDone] = useState(false); // TODO debug: reset to true

  useEffect(() => {
    const checkSync = async () => {
      try {
        await sync(database);
        console.log('SSSSYYYNNNCCC');
      } catch (e) {
        console.error(e);
      }
      setIsSyncDone(true);
    };

    checkSync();
  }, [database]);

  if (isSyncDone) {
    return children;
  }

  return <Loading />;
};
