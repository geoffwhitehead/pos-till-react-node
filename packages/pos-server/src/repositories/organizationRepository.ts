import { InjectedRepositoryDependencies } from '.';
import { OrganizationProps } from '../models/Organization';

export interface OrganizationRepository {
    findAll: () => Promise<OrganizationProps[]>;
}

export const organizationRepository = ({
    models: { OrganizationModel },
}: InjectedRepositoryDependencies): OrganizationRepository => {
    const findAll = async () => {
        return await OrganizationModel.find({});
    };

    return {
        findAll,
    };
};
