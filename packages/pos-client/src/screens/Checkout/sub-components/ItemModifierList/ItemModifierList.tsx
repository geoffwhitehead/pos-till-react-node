import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Item, Modifier } from '../../../../models';
import { CheckoutItemStackParamList } from '../../../../navigators/CheckoutItemNavigator';

interface ItemModifierListInnerProps {
  item: Item;
  modifier: Modifier;
  createBillItem;
}

interface ItemModifierListOuterProps {
  route: RouteProp<CheckoutItemStackParamList, 'ItemModifierList'>;
  navigation: StackNavigationProp<CheckoutItemStackParamList, 'ItemModifierList'>;
}

export const ItemModifierList: React.FC<ItemModifierListOuterProps & ItemModifierListInnerProps> = ({
  route,
  navigation,
}) => {
  // const { item, modifier, createBillItem } = route.params;
  // const [searchValue, setSearchValue] = useState<string>('');
  // const goBack = () => navigation.goBack();
  // const onPressModifierFactory = (item, mod) => () => {
  //   // create a new item with modifier in a the bill
  //   createBillItem(item, [mod]);
  //   goBack();
  // };
  // const onSearchHandler = (value: string) => setSearchValue(value);
  // // TODO: type
  // const searchFilter = (modifier: any, searchValue: string) =>
  //   modifier.name.toLowerCase().includes(searchValue.toLowerCase());
  // return (
  //   <Content>
  //     <SearchHeader onChangeText={onSearchHandler} value={searchValue} />
  //     <List>
  //       <ListItem itemHeader first>
  //         <Left>
  //           <Icon onPress={goBack} name="ios-arrow-back" />
  //           <Text style={{ fontWeight: 'bold' }}>{`${item.name} / Modifiers`}</Text>
  //         </Left>
  //         <Body />
  //         <Right />
  //       </ListItem>
  //       {modifier.mods
  //         .filter(mod => searchFilter(mod, searchValue))
  //         .map(mod => {
  //           return (
  //             <ListItem onPress={onPressModifierFactory(item, mod)}>
  //               <Text>{mod.name}</Text>
  //             </ListItem>
  //           );
  //         })}
  //     </List>
  //   </Content>
  // );
};
