import { InjectedRepositoryDependencies } from '.';
import { OrganizationProps } from '../models/Organization';
import { RepositoryFns, repository } from './utils';

export type OrganizationRepository = RepositoryFns<OrganizationProps>;

export const organizationRepository = ({ models: { OrganizationModel } }: InjectedRepositoryDependencies) =>
    repository<OrganizationProps, OrganizationRepository>({
        model: OrganizationModel,
        tenanted: false,
        fns: fns => {
            return fns;
        },
    });
