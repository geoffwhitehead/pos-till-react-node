import { Api } from './index'

export const getItems = () => Api.get('/product/items', {})
