import mongoose, { Schema } from 'mongoose';
import { tenantModel, TenantedModel } from './utils/multiTenant';
import { Joi } from 'celebrate';
import uuid from 'uuid';

export interface UserProps extends TenantedModel {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type UserPropsFull = UserProps & PrivateUserProps;

export const USER_COLLECTION_NAME = 'users';

interface PrivateUserProps {
    password: string;
    refreshToken?: string;
}

export const UserValidation = {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
};

export const CreateUserValidation = {
    ...UserValidation,
    password: Joi.string().required(),
};

const UserSchema: Schema<UserPropsFull> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: USER_COLLECTION_NAME,
    },
);

export const User = tenantModel<UserPropsFull>('User', UserSchema);
