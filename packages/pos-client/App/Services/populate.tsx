import { getItems } from '../api/items'
import { realm } from '../services/Realm'
import { getCategories } from '../api/category'
import { getModifiers } from '../api/modifier'
import { BillRegister } from './schemas'

export const populate = async () => {
  try {
    const [{ data: items }, { data: categories }, { data: modifiers }] = await Promise.all([
      getItems(),
      getCategories(),
      getModifiers(),
    ])

    const remappedModifiers = modifiers.map((modifier) => {
      return {
        ...modifier,
        mods: modifier.mods.map((mod, index) => {
          return {
            ...mod,
            // TODO: might be better to create _ids on server and change data structure
            _id: index.toString(),
            price: parseInt(mod.price),
          }
        }),
      }
    })
    realm.write(() => {
      realm.deleteAll()
      items.map((item) => {
        const i = {
          ...item,
          categoryId: categories.find((c) => c._id === item.categoryId),
          modifierId: item.modifierId
            ? remappedModifiers.find((m) => m._id === item.modifierId)
            : null,
        }
        // console.log('i', i)
        realm.create('Item', i, true)

        // need to update item.category with object
      })
      realm.create(BillRegister.name, {})
    })
  } catch (err) {
    console.log('ERROR ', err)
  }
}
