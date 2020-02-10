import Realm from 'realm'

const realm = new Realm({
  schema: [{ name: 'Dog', properties: { name: 'string' } }],
})

export { realm }
