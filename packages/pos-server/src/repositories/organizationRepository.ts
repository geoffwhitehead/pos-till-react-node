import { InjectedRepositoryDependencies } from '.';
import { OrganizationProps } from '../models/Organization';

export interface OrganizationRepository {
    findAll: () => Promise<OrganizationProps[]>;
    create: (p: OrganizationProps) => Promise<OrganizationProps>;
}

export const organizationRepository = ({
    models: { OrganizationModel },
}: InjectedRepositoryDependencies): OrganizationRepository => {
    const findAll: OrganizationRepository['findAll'] = async () => {
        return await OrganizationModel().find({});
    };

    const create: OrganizationRepository['create'] = async p => {
        return await OrganizationModel().create(p);
    };
    return {
        findAll,
        create,
    };
};
