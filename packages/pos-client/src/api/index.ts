import { create } from 'apisauce'

const Api = create({
  baseURL: 'http://localhost:5000',
  headers: { Accept: 'application/json' },
})

export { Api }
