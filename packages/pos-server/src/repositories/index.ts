import { userRepository, UserRepository } from './userRepository';
import Models from '../models';
import { organizationRepository, OrganizationRepository } from './organizationRepository';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
}

export interface InjectedRepositoryDependencies {
    models: {
        OrganizationModel: typeof Models.Organization;
        UserModel: typeof Models.User;
    };
}

export const registerRepositories = (): RepositoryService => {
    const models = {
        OrganizationModel: Models.Organization, // tenantless
        UserModel: Models.User,
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
            [name]: repo({ models }),
        };
    }, {} as RepositoryService);
};
