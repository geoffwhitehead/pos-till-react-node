import { InjectedRepositoryDependencies } from '.';
import { ModifierProps } from '../models/Modifier';
import { RepositoryFns, repository } from './utils';

export type ModifierRepository = RepositoryFns<ModifierProps>;

export const modifierRepository = ({ models: { ModifierModel } }: InjectedRepositoryDependencies) =>
    repository<ModifierProps, ModifierRepository>({
        model: ModifierModel,
        fns: fns => fns,
    });
