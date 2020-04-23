import { InjectedRepositoryDependencies } from '.';
import { ItemProps } from '../models/Item';
import { RepositoryFns, repository } from './utils';

export type ItemRepository = RepositoryFns<ItemProps> & {};

export const itemRepository = ({ models: { ItemModel } }: InjectedRepositoryDependencies) =>
    repository<ItemProps, ItemRepository>({
        model: ItemModel,
        fns: fns => fns,
    });
