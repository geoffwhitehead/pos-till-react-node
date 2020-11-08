import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { ActionSheet, Button, Icon, Input, Item, Text } from '../../core';
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
  ...props
}) => {
  const { priceGroup, setPriceGroup } = useContext(PriceGroupContext);
  const navigation = useNavigation();

  const onChangePriceGroup = () => {
    const options = [...priceGroups.map(({ name }) => name), 'Cancel'];
    ActionSheet.show(
      {
        options,
        cancelButtonIndex: options.length - 1,
        title: 'Select price group',
      },
      index => {
        /**
         * need to use set params to allow propgation through stack navigation. Everywhere else can use context hook.
         */
        if (index < options.length - 1) {
          navigation.setParams({
            priceGroupId: priceGroups[index].id,
          });
          setPriceGroup(priceGroups[index]);
        }
      },
    );
  };

  return (
    <Item {...props} style={styles.searchBar}>
      <Icon name="ios-search" />
      <Input placeholder="Search" onChangeText={onChangeText} value={value} />
      <Button small danger onPress={onChangePriceGroup}>
        <Text style={{ fontWeight: 'bold' }}>{`Price Group: ${priceGroup.name}`}</Text>
      </Button>
    </Item>
  );
};

export const SearchHeader = withDatabase(
  withObservables<SearchHeaderOuterProps, SearchHeaderInnerProps>([], ({ database }) => ({
    priceGroups: database.collections.get(tableNames.priceGroups).query(),
  }))(WrappedSearchHeader),
);

const styles = {
  searchBar: {
    paddingLeft: 15,
    paddingRight: 15,
  },
};
