import { UserProps, UserPropsFull } from '../models/User';
import { InjectedRepositoryDependencies, repository, RepositoryFns } from '.';
import { Container } from 'typedi';
import { pick } from 'lodash';

// export interface UserRepository {
//     findAll: () => Promise<UserProps[]>;
//     create: (user: UserPropsFull) => Promise<UserProps>;
//     findByIdAndUpdate: (id: string, user: Partial<UserProps>) => Promise<UserProps>;
//     findOne: (userProps: Partial<UserProps>) => Promise<UserProps | null>;
//     findOneFull: (userProps: Partial<UserProps>) => Promise<UserPropsFull | null>;
// }

export type UserRepository = {
    findAll: () => Promise<UserProps[]>;
    create: (props: UserPropsFull) => Promise<UserProps>;
    findOne: (props: Partial<UserPropsFull>) => Promise<UserProps>;
    findByIdAndUpdate: (id: string, props: Partial<UserPropsFull>) => Promise<UserProps>;
    findOneFull: (userProps: Partial<UserProps>) => Promise<UserPropsFull | null>;
};

const clean = (userRecord: UserPropsFull): UserProps => {
    return pick(userRecord, '_id', 'firstName', 'lastName', 'email', 'token');
};

export const userRepository = ({ models: { UserModel } }: InjectedRepositoryDependencies): UserRepository =>
    repository<UserPropsFull, UserRepository>({
        model: UserModel,
        fns: ({ create: _create, findAll: _findAll, findByIdAndUpdate: _findByIdAndUpdate, findOne: _findOne }) => {
            const findAll = async () => (await _findAll()).map(user => clean(user));
            const findByIdAndUpdate = async (id, props) => clean(await _findByIdAndUpdate(id, props));
            const findOne = async props => clean(await _findOne(props));
            const create = async props => clean(await _create(props));
            const findOneFull = async props => {
                const tenantId = Container.get('organizationId') as string;
                return (await UserModel({ tenantId }).findOne(props)).toObject();
            };
            return {
                findAll,
                findByIdAndUpdate,
                findOne,
                create,
                findOneFull,
            };
        },
    });

// const findAll = async () => {
//     const tenantId = Container.get('organizationId') as string;
//     const users = await UserModel({ tenantId }).find({});
//     return users.map(u => clean(u));
// };

// const create = async user => {
//     const tenantId = Container.get('organizationId') as string;
//     return clean(await UserModel({ tenantId }).create(user));
// };

// const findByIdAndUpdate = async (id, props) => {
//     const tenantId = Container.get('organizationId') as string;
//     return clean(await UserModel({ tenantId }).findByIdAndUpdate(id, props));
// };

// const findOne = async props => {
//     const tenantId = Container.get('organizationId') as string;
//     return clean(await UserModel({ tenantId }).findOne(props));
// };

/**
 * TODO: currently this is retunring full props including password because its needed
 * for auth. Look at creating a mapper layer to abstract this away.
 */

// return {
//     findAll,
//     create,
//     findByIdAndUpdate,
//     findOne,
//     findOneFull,
// };
// };
