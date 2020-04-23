import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { Joi } from 'celebrate';

export interface UserProps {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
    tenantId?: string; // TODO: fix
}

export type UserPropsFull = UserProps & PrivateUserProps;

interface PrivateUserProps {
    password: string;
    token?: string;
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
        token: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const User = tenantModel<UserPropsFull>('User', UserSchema);
