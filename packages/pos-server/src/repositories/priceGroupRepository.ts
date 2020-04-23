import { InjectedRepositoryDependencies } from '.';
import { PriceGroupProps } from '../models/PriceGroup';
import { RepositoryFns, repository } from './utils';

export type PriceGroupRepository = RepositoryFns<PriceGroupProps> & {};

export const priceGroupRepository = ({ models: { PriceGroupModel } }: InjectedRepositoryDependencies) =>
    repository<PriceGroupProps, PriceGroupRepository>({
        model: PriceGroupModel,
        fns: fns => fns,
    });
