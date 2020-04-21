import { InjectedRepositoryDependencies } from '.';
import { OrganizationProps } from '../models/Organization';

export interface OrganizationRepository {
    findAll: () => Promise<OrganizationProps[]>;
    create: (p: OrganizationProps) => Promise<OrganizationProps>;
    findOne: (p: Partial<OrganizationProps>) => Promise<OrganizationProps>;
}

export const organizationRepository = ({
    models: { OrganizationModel },
}: InjectedRepositoryDependencies): OrganizationRepository => {
    const findAll = async () => {
        return await OrganizationModel().find({});
    };

    const create = async p => {
        return await OrganizationModel().create(p);
    };

    const findOne = async p => {
        return await OrganizationModel().findOne(p);
    };

    return {
        findAll,
        create,
        findOne,
    };
};
