import { InjectedRepositoryDependencies } from '.';
import { ModifierPriceProps } from '../models/ModifierPrice';
import { RepositoryFns, repository } from './utils';

export type ModifierPriceRepository = RepositoryFns<ModifierPriceProps>;

export const modifierPriceRepository = ({ models: { ModifierPriceModel } }: InjectedRepositoryDependencies) =>
    repository<ModifierPriceProps, ModifierPriceRepository>({
        model: ModifierPriceModel,
        fns: fns => fns,
    });
