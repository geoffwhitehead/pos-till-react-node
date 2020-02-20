import { getItems } from '../api/items'
import { realm } from '../services/Realm'
import { getCategories } from '../api/category'
import { getModifiers } from '../api/modifier'

export const populate = async () => {
  try {
    const [{ data: items }, { data: categories }, { data: modifiers }] = await Promise.all([
      getItems(),
      getCategories(),
      getModifiers(),
    ])

    console.log('items', items)
    console.log('categories', categories)
    console.log('modifiers', modifiers)

    const remappedModifiers = modifiers.map((modifier) => {
      return {
        ...modifier,
        mods: modifier.mods.map((mod, index) => {
          return {
            ...mod,
            _id: index.toString(),
            price: parseInt(mod.price),
          }
        }),
      }
    })
    realm.write(() => {
      items.map((item) => {
        realm.create(
          'Item',
          {
            ...item,
            categoryId: categories.find((c) => c._id === item.categoryId),
            modifierId: item.modifierId
              ? remappedModifiers.find((m) => m._id === item.modifierId)
              : null,
          },
          true
        )

        // need to update item.category with object
      })
    })
  } catch (err) {
    console.log('ERROR ', err)
  }
}
