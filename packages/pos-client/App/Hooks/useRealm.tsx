import { useState } from 'react'
import Realm from 'realm'

export const useRealm = async () => {
  const r = await Realm.open({
    schema: [{ name: 'Dog', properties: { name: 'string' } }],
  })

  const [realm, setRealm] = useState(r)

  return realm
}
