import { Dictionary } from 'lodash';
import React from 'react';
import { ItemPrice } from '../models';

export type GroupedPrices = Dictionary<Dictionary<ItemPrice>>;

type ItemPricesContextProps = {
  setGroupedItemPrices: (itemPrices: GroupedPrices) => void;
  groupedItemPrices: GroupedPrices;
};

export const ItemPricesContext = React.createContext<ItemPricesContextProps>({
  setGroupedItemPrices: null,
  groupedItemPrices: {},
});
