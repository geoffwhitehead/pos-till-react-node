import { InjectedRepositoryDependencies } from '.';
import { DiscountProps } from '../models/Discount';
import { RepositoryFns, repository } from './utils';

export type DiscountRepository = RepositoryFns<DiscountProps> & {};

export const discountRepository = ({ models: { DiscountModel } }: InjectedRepositoryDependencies) =>
    repository<DiscountProps, DiscountRepository>({
        model: DiscountModel,
        fns: fns => fns,
    });
