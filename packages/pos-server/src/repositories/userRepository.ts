import { UserProps } from '../models/User';
import { InjectedRepositoryDependencies } from '.';

export interface UserRepository {
    findAll: () => Promise<UserProps[]>;
}

export const userRepository = ({ models: { UserModel } }: InjectedRepositoryDependencies): UserRepository => {
    const findAll = async () => {
        return await UserModel.find({});
    };

    return {
        findAll,
    };
};
