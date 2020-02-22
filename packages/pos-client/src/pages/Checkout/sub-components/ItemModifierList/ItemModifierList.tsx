import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
// import { useRealmQuery } from 'react-use-realm'
// import { ItemSchema, ModifierSchema } from '../../../../services/schemas'
// import { routes } from '../../../../navigators/CheckoutItemTabNavigator'

export const ItemModifierList: React.FC = ({ route, navigation }) => {
  const { item, modifier, createBillItem } = route.params

  console.log('modifier', item)

  console.log('modifiers', modifier)

  const goBack = () => navigation.goBack()

  const onPressModifierFactory = (item, mod) => () => {
    // create a new item with modifier in a the bill
    createBillItem(item, [mod])
    goBack()
  }

  return (
    <Content>
      <SearchHeader />
      <List>
        <ListItem itemHeader first>
          <Left>
            <Icon onPress={goBack} name="ios-arrow-back" />
            <Text>{`${item.name} / Modifiers`}</Text>
          </Left>
          <Body></Body>
          <Right />
        </ListItem>
        {modifier.mods.map((mod) => {
          return (
            <ListItem onPress={onPressModifierFactory(item, mod)}>
              <Text>
                {mod.name} - {mod.price}
              </Text>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}
