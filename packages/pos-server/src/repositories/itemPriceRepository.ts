import { InjectedRepositoryDependencies } from '.';
import { ItemPriceProps } from '../models/ItemPrice';
import { RepositoryFns, repository } from './utils';

export type ItemPriceRepository = RepositoryFns<ItemPriceProps>;

export const itemPriceRepository = ({ models: { ItemPriceModel } }: InjectedRepositoryDependencies) =>
    repository<ItemPriceProps, ItemPriceRepository>({
        model: ItemPriceModel,
        fns: fns => fns,
    });
