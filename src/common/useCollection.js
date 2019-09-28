import React from 'react';

import { db } from '../db';
import resourceConfig from './resourceConfig';

export default function useCollection(initialResourceConfig = resourceConfig) {
  const [config, setConfig] = React.useState(initialResourceConfig);
  const [isBusy, setIsBusy] = React.useState(false);
  const [data, setData] = React.useState([]);

  React.useEffect(
    () => {
      const { ref, orderBy, isDescending } = config;
      if (!ref) return;
      getCollection();

      async function getCollection() {
        setIsBusy(true);

        const querySnapshot = await db
          .collection(ref)
          .orderBy(orderBy, isDescending && 'desc')
          .get();

        setData(querySnapshot.docs);
        setIsBusy(false);
      }
    },
    [config]
  );

  const getCollection = React.useCallback(
    resourceConfig => setConfig(resourceConfig),
    []
  );

  return {
    getCollection,
    isBusy,
    data
  };
}
