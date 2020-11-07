import { InjectedRepositoryDependencies } from '.';
import { ModifierItemPriceProps } from '../models/ModifierItemPrice';
import { repository, RepositoryFns } from './utils';

export type ModifierItemPriceRepository = RepositoryFns<ModifierItemPriceProps>;

export const modifierItemPriceRepository = ({ models: { ModifierItemPriceModel } }: InjectedRepositoryDependencies) =>
    repository<ModifierItemPriceProps, ModifierItemPriceRepository>({
        model: ModifierItemPriceModel,
        fns: fns => fns,
    });
