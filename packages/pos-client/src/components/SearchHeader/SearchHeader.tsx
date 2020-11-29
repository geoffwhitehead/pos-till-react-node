import { Database } from '@nozbe/watermelondb';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { useNavigation } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { PriceGroupContext } from '../../contexts/PriceGroupContext';
import { Icon, Input, Item, Label, Picker, Text } from '../../core';
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

  // const onChangePriceGroup = () => {
  //   const options = [...priceGroups.map(({ name }) => name), 'Cancel'];
  //   const cancelIndex = options.length - 1;
  //   ActionSheet.show(
  //     {
  //       options,
  //       title: 'Please select a price group',
  //     },
  //     index => {
  //       /**
  //        * need to use set params to allow propgation through stack navigation. Everywhere else can use context hook.
  //        */
  //       if (index !== cancelIndex) {
  //         navigation.setParams({
  //           priceGroupId: priceGroups[index].id,
  //         });
  //         setPriceGroup(priceGroups[index]);
  //       }
  //     },
  //   );
  // };

  const handleChangePriceGroup = priceGroupId => {
    const priceGroup = priceGroups.find(priceGroup => priceGroup.id === priceGroupId);
    navigation.setParams({
      priceGroupId,
    });
    setPriceGroup(priceGroup);
  };

  return (
    <Item {...props} style={styles.searchBar}>
      <Icon name="ios-search" />
      <Input placeholder="Search" onChangeText={onChangeText} value={value} />
      <Label>
        <Text style={{ color: 'grey' }}>Price Group: </Text>
      </Label>
      <Picker
        mode="dropdown"
        iosHeader="Select a price group"
        iosIcon={<Icon name="arrow-down" />}
        placeholder="Select a price group"
        textStyle={{ color: 'grey' }}
        placeholderIconColor="#007aff"
        style={{ width: undefined }}
        selectedValue={priceGroup.id}
        onValueChange={handleChangePriceGroup}
      >
        {priceGroups.map(({ id, name }) => {
          return <Picker.Item key={id} label={name} value={id} />;
        })}
      </Picker>
      {/* <Button small danger onPress={onChangePriceGroup}>
        <Text style={{ fontWeight: 'bold' }}>{`Price Group: ${priceGroup.name}`}</Text>
      </Button> */}
    </Item>
  );
};

export const SearchHeader = withDatabase(
  withObservables<SearchHeaderOuterProps, SearchHeaderInnerProps>([], ({ database }) => ({
    priceGroups: database.collections.get(tableNames.priceGroups).query(),
  }))(WrappedSearchHeader),
);

const styles = StyleSheet.create({
  searchBar: {
    paddingLeft: 15,
    paddingRight: 15,
  },
});
