import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ItemProps, ModifierItemProps } from '../../../../../../services/schemas';
import { Content, Text, List, ListItem, Left, Icon, Body, Right, Button } from '../../../../../../core';
import { withDatabase } from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import { tNames } from '../../../../../../models';
import { PriceGroupContext } from '../../../../../../contexts/PriceGroupContext';
import { CurrentBillContext } from '../../../../../../contexts/CurrentBillContext';
import { ModifierGroup } from './ModifierGroup';
import { Formik } from 'formik';

interface ItemModifierListProps {
  item?: ItemProps;
  currentBill: any;
  priceGroup: any;
  onClose: () => void;
  modifiers: any;
}

export const WrappedItemModifierList: React.FC<ItemModifierListProps> = ({
  item,
  currentBill,
  priceGroup,
  onClose,
  modifiers,
}) => {
  // const onPressModifierFactory = (mod: ModifierItemProps) => () => {
  //   // create a new item with modifier in a the bill
  //   createBillItem([mod]);
  // };

  const createItemWithModifiers = async modifierItems => {
    // setModalOpen(false);
    await currentBill.addItem({ item, priceGroup });

    modifierItems.map(modifierItem => {});
  };

  return (
    <Content style={styles.modal}>
      {/* <SearchHeader onChangeText={onSearchHandler} value={searchValue} /> */}

      <Button>
        <Text onPress={createItemWithModifiers}>Save</Text>
      </Button>
      {item && (
        <List>
          <ListItem itemHeader first>
            <Left>
              <Icon onPress={onClose} name="ios-arrow-back" />
              <Text style={{ fontWeight: 'bold' }}>{`${item.name} / Modifiers`}</Text>
            </Left>
            <Body></Body>
            <Right />
          </ListItem>
          <Formik
            initialValue={{ modifiers: modifiers.map(m => ({ [m.id]: [] })) }}
            onSubmit={values => console.log('values', values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) =>
              modifiers.map(modifier => <ModifierGroup modifier={modifier} priceGroup={priceGroup}/>)
            }
          </Formik>
          {/* {item.modifierId.mods
            // 
            .map(mod => {
              return (
                <ListItem key={mod._id} onPress={onPressModifierFactory(mod)}>
                  <Text>{mod.name}</Text>
                </ListItem>
              );
            })} */}
        </List>
      )}
    </Content>
  );
};

export const ItemModifierList = withDatabase<any, any>( // TODO: fix type
  withObservables(['item'], ({ item, database }) => ({
    modifiers: item.modifiers.fetch().observe(),
    // prices: database.collections.get(tNames.modifierPrices).query(),
  }))(WrappedItemModifierList),
);

const styles = StyleSheet.create({
  modal: {
    borderRadius: 5,
    backgroundColor: 'white',
    width: 400,
  },
});
