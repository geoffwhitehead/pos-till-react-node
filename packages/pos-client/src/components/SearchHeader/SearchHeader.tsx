import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { ActionSheet, Button, Header, Icon, Input, Item, Right, Text } from '../../core';
import { PriceGroup, tableNames } from '../../models';

interface SearchHeaderOuterProps {
  onChangeText: (value: string) => void;
  value: string;
  database: Database;
}

interface SearchHeaderInnerProps {
  onChangeText: (value: string) => void;
  value: string;
  priceGroups: PriceGroup[];
}

export const WrappedSearchHeader: React.FC<SearchHeaderOuterProps & SearchHeaderInnerProps> = ({
  priceGroups,
  onChangeText,
  value = '',
}) => {
  const { priceGroup, setPriceGroup } = useContext(PriceGroupContext);
  const navigation = useNavigation();

  const onChangePriceGroup = () => {
    const options = [...priceGroups.map(({ name }) => name), 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length,
        title: 'Select price group',
      },
      index => {
        console.log('priceGroups[index]', priceGroups[index]);
        /**
         * need to use set params to allow propgation through stack navigation. Everywhere else can use context hook.
         */
        navigation.setParams({
          priceGroupId: priceGroups[index].id,
        });
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
  withObservables<SearchHeaderOuterProps, SearchHeaderInnerProps>([], ({ database }) => ({
    priceGroups: database.collections.get(tableNames.priceGroups).query(),
  }))(WrappedSearchHeader),
);
