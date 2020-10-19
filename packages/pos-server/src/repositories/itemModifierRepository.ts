import { InjectedRepositoryDependencies } from '.';
import { ItemModifierProps } from '../models/ItemModifier';
import { RepositoryFns, repository } from './utils';

export type ItemModifierRepository = RepositoryFns<ItemModifierProps>;

export const itemModifierRepository = ({ models: { ItemModifierModel } }: InjectedRepositoryDependencies) =>
    repository<ItemModifierProps, ItemModifierRepository>({
        model: ItemModifierModel,
        fns: fns => fns,
    });
