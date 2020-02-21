import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema } from '../../../../services/schemas'
import { routes } from '../../../../navigators/CheckoutItemNavigator'

export const CategoryItemsList: React.FC = ({ route, navigation }) => {
  const { category } = route.params

  console.log('category', category)
  const items = useRealmQuery({
    source: ItemSchema.name,
    sort: ['name'],
    filter: 'categoryId._id CONTAINS $0',
    variables: category._id,
  })

  const goBack = () => navigation.goBack()

  const onPressItemFactory = (item) => () => {
    if (item.modifierId) {
      navigation.navigate(routes.itemModifierList, {
        item,
      })
    } else {
      // create a new bill item

      goBack()
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
            <ListItem onPress={onPressItemFactory(item)}>
              <Text>{item.name}</Text>
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}
