import React from 'react';
import { StyleSheet } from 'react-native';
import { ItemProps, ModifierItemProps } from '../../../../../../services/schemas';
import { Content, Text, List, ListItem, Left, Icon, Body, Right } from '../../../../../../core';

interface ItemModifierListProps {
  item?: ItemProps;
  createBillItem: (mod: ModifierItemProps[]) => void;
  onCancel: () => void;
}

export const ItemModifierList: React.FC<ItemModifierListProps> = ({ item, createBillItem, onCancel, ...props }) => {
  const onPressModifierFactory = (mod: ModifierItemProps) => () => {
    // create a new item with modifier in a the bill
    createBillItem([mod]);
  };

  return (
    <Content style={styles.modal}>
      {/* <SearchHeader onChangeText={onSearchHandler} value={searchValue} /> */}

      {item && (
        <List>
          <ListItem itemHeader first>
            <Left>
              <Icon onPress={onCancel} name="ios-arrow-back" />
              <Text style={{ fontWeight: 'bold' }}>{`${item.name} / Modifiers`}</Text>
            </Left>
            <Body></Body>
            <Right />
          </ListItem>
          {item.modifierId.mods
            // .filter(mod => searchFilter(mod, searchValue))
            .map(mod => {
              return (
                <ListItem key={mod._id} onPress={onPressModifierFactory(mod)}>
                  <Text>{mod.name}</Text>
                </ListItem>
              );
            })}
        </List>
      )}
    </Content>
  );
};
const styles = StyleSheet.create({
  modal: {
    borderRadius: 5,
    backgroundColor: 'white',
    width: 400,
  },
});
