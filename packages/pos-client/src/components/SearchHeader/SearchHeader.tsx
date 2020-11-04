import React, { useContext } from 'react';
import { Item, Icon, Input, Header, Right, Text, Button, ActionSheet } from '../../core';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tableNames } from '../../models';

interface SearchHeaderProps {
  onChangeText: (value: string) => void;
  value: string;
  priceGroups: any[];
}

export const WrappedSearchHeader: React.FC<SearchHeaderProps> = ({ priceGroups, onChangeText, value = '' }) => {
  const { priceGroup, setPriceGroup } = useContext(PriceGroupContext);

  const onChangePriceGroup = () => {
    const options = [...priceGroups.map(({ name }) => name), 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: 'Select price group',
      },
      index => {
        index < priceGroups.length && setPriceGroup(priceGroups[index]);
      },
    );
  };

  return (
    <Header searchBar rounded>
      <Item>
        <Icon name="ios-search" />
        <Input placeholder="Search" onChangeText={onChangeText} value={value} />
      </Item>
      <Right>
        <Button style={{ marginBottom: 15 }} onPress={onChangePriceGroup}>
          <Text>{priceGroup.name}</Text>
        </Button>
      </Right>
    </Header>
  );
};

export const SearchHeader = withDatabase(
  withObservables<any, any>([], ({ database }) => ({
    priceGroups: database.collections
      .get(tableNames.priceGroups)
      .query()
      .observe(),
  }))(WrappedSearchHeader),
);
