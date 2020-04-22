import { userRepository, UserRepository } from './userRepository';
import Models from '../models';
import { organizationRepository, OrganizationRepository } from './organizationRepository';
import Container from 'typedi';
import { TenantModel } from '../services/multiTenant';
import { categoryRepository, CategoryRepository } from './categoryRepository';
import mongoose from 'mongoose';
import { omit } from 'lodash';

export interface RepositoryService {
    userRepository: UserRepository;
    organizationRepository: OrganizationRepository;
    categoryRepository: CategoryRepository;
}

export interface InjectedRepositoryDependencies {
    models: {
        OrganizationModel: typeof Models.Organization;
        UserModel: typeof Models.User;
        CategoryModel: typeof Models.Category;
    };
}

export const registerRepositories = (): RepositoryService => {
    const models = {
        OrganizationModel: Models.Organization, // tenantless
        UserModel: Models.User,
        CategoryModel: Models.Category,
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
        {
            name: 'categoryRepository',
            repo: categoryRepository,
        },
    ];

    return repositories.reduce((out, { name, repo }) => {
        return {
            ...out,
            [name]: repo({ models }),
        };
    }, {} as RepositoryService);
};

// type Repository = <T>(params: {
//     model: T & mongoose.Document;
//     tenanted: boolean;
//     fn: (fns: RepositoryFns<T>) => void;
// }) => void;

export interface RepositoryFns<T> {
    findAll: () => Promise<T[]>;
    create: (props: T) => Promise<T>;
    findOne: (props: Partial<T>) => Promise<T>;
    findByIdAndUpdate: (id: string, props: Partial<T>) => Promise<T>;
}

const getTenant = () => ({
    tenantId: Container.get('organizationId') as string, // TODO: type no cast
});

const clean = (doc: mongoose.Document) => {
    return omit(doc.toObject(), 'tenantId');
};

export const repository = <T, U>({
    model,
    tenanted = true,
    fns,
}: {
    model: TenantModel<T>;
    tenanted?: boolean;
    // fns: <U extends Partial<RepositoryFns<T>>>(fns: RepositoryFns<T>) => U;
    // fns: <U>(fns: RepositoryFns<T>) => U;
    fns: (fns: RepositoryFns<T>) => U;
}) => {
    const findAll = async () => {
        const docs = await model(tenanted && getTenant()).find({});
        return docs.map(doc => clean(doc));
    };

    const create = async props => {
        const filteredProps = omit(props, 'tenantId');
        const doc = await model(tenanted && getTenant()).create(filteredProps);
        return clean(doc);
    };

    const findOne = async props => {
        const doc = await model(tenanted && getTenant()).findOne(props);
        return clean(doc);
    };

    const findByIdAndUpdate = async (id, props) => {
        const filteredProps = omit(props, 'tenantId');
        const updatedDoc = await model(tenanted && getTenant()).findByIdAndUpdate(id, filteredProps, { new: true });
        return clean(updatedDoc);
    };

    return fns({ findAll, create, findOne, findByIdAndUpdate });
};
