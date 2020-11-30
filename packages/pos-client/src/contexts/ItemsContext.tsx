import React from 'react';
import { Item } from '../models';

type ItemsContextProps = {
  setSortedItems: (sortedItems: Item[]) => void;
  sortedItems: Item[];
};

export const ItemsContext = React.createContext<ItemsContextProps>({
  setSortedItems: null,
  sortedItems: [],
});
