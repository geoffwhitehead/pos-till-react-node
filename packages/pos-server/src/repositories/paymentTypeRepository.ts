import { InjectedRepositoryDependencies } from '.';
import { PaymentTypeProps } from '../models/PaymentType';
import { RepositoryFns, repository } from './utils';

export type PaymentTypeRepository = RepositoryFns<PaymentTypeProps> & {};

export const paymentTypeRepository = ({ models: { PaymentTypeModel } }: InjectedRepositoryDependencies) =>
    repository<PaymentTypeProps, PaymentTypeRepository>({
        model: PaymentTypeModel,
        fns: fns => fns,
    });
