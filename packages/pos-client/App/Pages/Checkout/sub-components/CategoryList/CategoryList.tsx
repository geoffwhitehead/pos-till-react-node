import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
import { useRealmQuery } from 'react-use-realm'
import { CategorySchema } from '../../../../services/schemas'
import { routes } from '../../../../navigators/CheckoutItemNavigator'

export const CategoryList: React.FC = ({ navigation }) => {
  const categories = useRealmQuery({ source: CategorySchema.name, sort: ['name'] })

  const onPressCategoryFactory = (category) => () =>
    navigation.navigate(routes.categoryItemList, {
      category,
    })

  return (
    <Content>
      <SearchHeader />
      <List>
        <ListItem itemHeader first>
          <Text>Categories</Text>
        </ListItem>
        {categories.map((cat) => {
          return (
            <ListItem icon onPress={onPressCategoryFactory(cat)}>
              <Left>
                <Icon name="ios-arrow-forward" />
              </Left>
              <Body>
                <Text>{cat.name}</Text>
              </Body>
              <Right />
            </ListItem>
          )
        })}
      </List>
    </Content>
  )
}
