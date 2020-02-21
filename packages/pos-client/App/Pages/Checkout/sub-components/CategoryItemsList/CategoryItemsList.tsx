import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema } from '../../../../services/schemas'
import { routes } from '../../../../navigators/CheckoutItemNavigator'

export const CategoryItemsList: React.FC = ({ route, navigation }) => {
  const { category, items, modifiers, createBillItem } = route.params

  // console.log('category', category)
  // const items = useRealmQuery({
  //   source: ItemSchema.name,
  //   sort: ['name'],
  //   filter: 'categoryId._id CONTAINS $0',
  //   variables: category._id,
  // })

  const goBack = () => navigation.goBack()

  const onPressItemFactory = (item) => () => {
    console.log('item', item)
    if (item.modifierId) {
      const modifier = modifiers.filtered(`_id = "${item.modifierId._id}"`)[0]
      console.log('modifier', modifier)
      navigation.navigate(routes.itemModifierList, {
        item,
        modifier,
        createBillItem,
      })
    } else {
      // create a new bill item
      createBillItem(item)
    }
  }

  return (
    <Content>
      <SearchHeader />
      <List>
        <ListItem itemHeader first>
          <Left>
            <Icon onPress={goBack} name="ios-arrow-back" />
            <Text>{`${category.name} / Items`}</Text>
          </Left>
          <Body></Body>
          <Right />
        </ListItem>
        {items.map((item) => {
          return (
            <ListItem key={item._id} onPress={onPressItemFactory(item)}>
              <Text>{item.name}</Text>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}
