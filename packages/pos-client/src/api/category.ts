import { Api } from './index'

export const getCategories = () => Api.get('/categories', {})
