import { useState, useEffect } from 'react';

export const useRealmResultsHook = (query, args = []) => {
  const [data, setData] = useState({
    data: args ? query(...args) : query(),
    a: Date.now(),
  });

  useEffect(() => {
    function handleChange(newData) {
      setData({
        data: newData,
        a: Date.now(), // the "hacky" fix, this will create a
      }); // different object and execute a re-render
    }

    const dataQuery = args ? query(...args) : query();

    dataQuery.addListener(handleChange);

    return () => {
      dataQuery.removeAllListeners();
    };
  }, [query, ...args]);

  return data.data; // this hook will return only the data from realm
};

// significantly degrades performance when i use this. Reverted to use the realm hook npm module.
// Still need to solve the problem about useEffect and other hooks not updating when a state assigned realm
// object is in the dependency array.

//https://github.com/realm/realm-js/issues/2345
