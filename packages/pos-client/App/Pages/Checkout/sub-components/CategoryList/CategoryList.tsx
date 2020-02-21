import React from 'react'
import { Text, Content, List, ListItem, Left, Icon, Body, Right } from '../../../../core'
import { SearchHeader } from '../../../../components/SearchHeader/SearchHeader'
import { useRealmQuery } from 'react-use-realm'
import {
  CategorySchema,
  ItemSchema,
  ModifierSchema,
  BillItemSchema,
  BillItemModifierSchema,
  BillSchema,
} from '../../../../services/schemas'
import { routes } from '../../../../navigators/CheckoutItemNavigator'
import { realm } from '../../../../services/Realm'
import uuidv4 from 'uuid/v4'

export const CategoryList: React.FC = ({ navigation, route }) => {
  const { activeBill } = route.params
  const categories = useRealmQuery({ source: CategorySchema.name, sort: ['name'] })
  const items = useRealmQuery({ source: ItemSchema.name })
  const modifiers = useRealmQuery({ source: ModifierSchema.name })
  // filter: '_id CONTAINS $0',
  // variables: item.modifierId._id,

  categories.map((c) => console.log('c', c))

  const createBillItem = (item, mods = []) => {
    console.log('creating bill item', item, mods)

    const newModItems = mods.map((mod) => {
      console.log('mod', mod)
      const { _id: modId, name, price } = mod
      return {
        _id: uuidv4(),
        modId,
        name,
        price,
      }
    })

    console.log('creating bill item')
    const {
      _id: itemId,
      name,
      categoryId: { _id: categoryId, name: categoryName },
      modifierId: { _id: modifierId },
      price,
    } = item

    const newBillItem = {
      _id: uuidv4(),
      itemId,
      name,
      price,
      modifierId,
      mods: newModItems.map((m) => m._id),
      categoryId,
      categoryName,
    }

    realm.write(() => {
      // create bill and items
      newModItems.map((modItem) => realm.create(BillItemModifierSchema.name, modItem))
      realm.create(BillItemSchema.name, newBillItem)
      activeBill.items = [...activeBill.items, newBillItem]
    })
  }

  const onPressCategoryFactory = (category) => () => {
    // console.log('category', category)

    const filtered = items.filtered(`categoryId._id = "${category._id}"`)
    // filtered.map((f) => console.log('f', f))
    // console.log('items', items)
    navigation.navigate(routes.categoryItemList, {
      category,
      items: filtered,
      modifiers,
      createBillItem,
    })
  }

  // const createBillMods = (mods) => {
  //   console.log('creating mods')
  // }

  return (
    <Content>
      <SearchHeader />
      <List>
        <ListItem itemHeader first>
          <Text>Categories</Text>
        </ListItem>
        {categories.map((cat) => {
          return (
            <ListItem key={cat._id} icon onPress={onPressCategoryFactory(cat)}>
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
