import { UserProps, UserPropsFull } from '../models/User';
import { InjectedRepositoryDependencies } from '.';
import { Container } from 'typedi';
import mongoose from 'mongoose';
import { pick } from 'lodash';

export interface UserRepository {
    findAll: () => Promise<UserProps[]>;
    create: (user: UserPropsFull) => Promise<UserProps>;
    updateById: (id: string, user: Partial<UserProps>) => Promise<UserProps>;
}

const clean = (userRecord: UserPropsFull & mongoose.Document): UserProps => {
    return pick(userRecord.toObject(), '_id', 'firstName', 'lastName', 'email', 'token');
};

export const userRepository = ({ models: { UserModel } }: InjectedRepositoryDependencies): UserRepository => {
    const findAll = async () => {
        const tenantId = Container.get('organizationId') as string;
        const users = await UserModel({ tenantId }).find({});
        return users.map(u => clean(u));
    };

    const create = async user => {
        const tenantId = Container.get('organizationId') as string;
        return clean(await UserModel({ tenantId }).create(user));
    };

    const updateById = async (id, props) => {
        const tenantId = Container.get('organizationId') as string;
        return clean(await UserModel({ tenantId }).findByIdAndUpdate(id, props));
    };

    return {
        findAll,
        create,
        updateById,
    };
};
