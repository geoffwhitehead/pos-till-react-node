import mongoose, { Schema } from 'mongoose';
import { tenantModel, TenantedModel } from './utils/multiTenant';
import { Joi } from 'celebrate';

export interface UserProps extends TenantedModel {
    _id?: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    refreshToken?: string;
}

export type UserPropsFull = UserProps & PrivateUserProps;

interface PrivateUserProps {
    password: string;
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
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

export const User = tenantModel<UserPropsFull>('User', UserSchema);
