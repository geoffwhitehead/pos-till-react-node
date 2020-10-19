import { InjectedRepositoryDependencies } from '.';
import { ModifierItemProps } from '../models/ModifierItem';
import { RepositoryFns, repository } from './utils';

export type ModifierItemRepository = RepositoryFns<ModifierItemProps>;

export const modifierItemRepository = ({ models: { ModifierItemModel } }: InjectedRepositoryDependencies) =>
    repository<ModifierItemProps, ModifierItemRepository>({
        model: ModifierItemModel,
        fns: fns => fns,
    });
