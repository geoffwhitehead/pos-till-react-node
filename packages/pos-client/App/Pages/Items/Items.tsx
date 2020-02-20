import React from 'react'
import { Text, Content, List, Separator, ListItem, Container, Badge } from '../../core'
import { SidebarHeader } from '../../components/SidebarHeader/SidebarHeader'
import { Loading } from '../Loading/Loading'
import { useRealmQuery } from 'react-use-realm'
import { ItemSchema, CategorySchema } from '../../services/schemas'

export const Items = ({ navigation }) => {
  const items = useRealmQuery({
    source: ItemSchema.name,
    sort: ['categoryId.name', 'name'],
  })

  return !items ? (
    <Loading />
  ) : (
    <Container>
      <SidebarHeader title="Items" onOpen={navigation.toggleDrawer()} />
      <Content>
        <List>
          {items.reduce((acc, cur, index) => {
            const firstRecord = index === 0
            const currentRecordIsNewCategory =
              !firstRecord && items[index - 1].categoryId.name !== cur.categoryId.name
            const Item = (
              <ListItem>
                <Text>{cur.name}</Text>
              </ListItem>
            )
            const Divider = (
              <Separator bordered>
                <Text>{cur.categoryId.name}</Text>
              </Separator>
            )
            if (firstRecord || currentRecordIsNewCategory) {
              return [...acc, Divider, Item]
            } else {
              return [...acc, Item]
            }
          }, [])}
        </List>
      </Content>
    </Container>
  )
}
