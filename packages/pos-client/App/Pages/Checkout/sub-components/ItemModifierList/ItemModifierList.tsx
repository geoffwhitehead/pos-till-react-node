import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema, ModifierSchema } from '../../../../services/schemas'
import { routes } from '../../../../navigators/CheckoutItemTabNavigator'

export const ItemModifierList: React.FC = ({ route, navigation }) => {
  const { item } = route.params

  console.log('modifier', item)
  const modifiers = useRealmQuery({
    source: ModifierSchema.name,
    filter: '_id CONTAINS $0',
    variables: item.modifierId._id,
  })

  console.log('modifiers', modifiers)

  const goBack = () => navigation.goBack()

  const onPressModifierFactory = (mod) => () => {
    // create a new item with modifier in a the bill

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
        {modifiers[0].mods.map((mod) => {
          return (
            <ListItem onPress={onPressModifierFactory(mod)}>
              <Text>{mod.name}</Text>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}
