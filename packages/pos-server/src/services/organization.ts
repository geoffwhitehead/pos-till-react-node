import { InjectedDependencies } from '.';
import { RepositoryFns } from '../repositories/utils';
import { OrganizationProps } from '../models/Organization';

export type OrganizationService = RepositoryFns<OrganizationProps>;

export const organizationService = ({ repositories: { organizationRepository }, logger }: InjectedDependencies): OrganizationService =>
    organizationRepository;
