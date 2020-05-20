import React, { useContext } from 'react';
import { Item, Icon, Input, Header, Right, Text, Button, ActionSheet } from '../../core';
import { useRealmQuery } from 'react-use-realm';
import { PriceGroupProps, PriceGroupSchema } from '../../services/schemas';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../models';

interface SearchHeaderProps {
  onChangeText: (value: string) => void;
  value: string;
}

export const WrappedSearchHeader: React.FC<SearchHeaderProps> = ({ priceGroups, onChangeText, value = '', buttonText, buttonOnPress }) => {
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
        setPriceGroup(priceGroups[index]);
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
  withObservables([], ({ database }) => ({
    priceGroups: database.collections
      .get(tNames.priceGroups)
      .query()
      .observe(),
  }))(WrappedSearchHeader),
);
