import { Api } from './index'

export const getModifiers = () => Api.get('/modifiers', {})
