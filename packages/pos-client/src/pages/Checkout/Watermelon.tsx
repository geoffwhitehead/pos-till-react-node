import React, { useState } from 'react';
import { Text, Content, List, ListItem, Left, Body, Right, Button, Separator } from '../../core';
import { Categories } from './tests/Categories';
import { PriceGroups } from './tests/PriceGroups';
import { Printers } from './tests/Printers';
import { Modifiers } from './tests/Modifiers';
import { Discounts } from './tests/Discounts';
import { Items } from './tests/Items';
export const Watermelon: React.FC<any> = ({ categories, database }) => {
  return (
    <Content>
      {/* <Categories />
      <PriceGroups /> */}
      {/* <Modifiers /> */}
      {/* <Discounts /> */}
      <Items />
      {/* <Printers /> */}
    </Content>
  );
};

// export const Categories = enhance(CategoryList);
