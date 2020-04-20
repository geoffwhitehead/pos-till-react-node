import { userRepository, UserRepository } from './userRepository';
import Models from '../models';
import { organizationRepository, OrganizationRepository } from './organizationRepository';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
}

export interface InjectedRepositoryDependencies {
    models: {
        OrganizationModel: ReturnType<typeof Models.Organization>;
        UserModel: ReturnType<typeof Models.User>;
    };
}

export const registerRepositories = (organizationId: string): RepositoryService => {
    const tenantedModels = {
        OrganizationModel: Models.Organization(), // tenantless
        UserModel: Models.User({ tenantId: organizationId }),
    };

    const repositories = [
        {
            name: 'userRepository',
            repo: userRepository,
        },
        {
            name: 'organizationRepository',
            repo: organizationRepository,
        },
    ];

    return repositories.reduce((out, { name, repo }) => {
        return {
            ...out,
            [name]: repo({ models: tenantedModels }),
        };
    }, {} as RepositoryService);
};
