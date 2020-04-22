import { InjectedRepositoryDependencies, repository, RepositoryFns } from '.';
import { OrganizationProps } from '../models/Organization';

export type OrganizationRepository = RepositoryFns<OrganizationProps> & {};

// findAll: () => Promise<OrganizationProps[]>;
// create: (p: OrganizationProps) => Promise<OrganizationProps>;
// findOne: (p: Partial<OrganizationProps>) => Promise<OrganizationProps>;

export const organizationRepository = ({ models: { OrganizationModel } }: InjectedRepositoryDependencies) =>
    repository<OrganizationProps, OrganizationRepository>({
        model: OrganizationModel,
        tenanted: false,
        fns: fns => {
            return fns;
        },
    });
