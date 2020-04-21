import { Schema } from 'mongoose';
import { tenantlessModel } from '../services/multiTenant';
import { Joi } from 'celebrate';

export interface OrganizationProps {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    address: {
        line1: string;
        line2?: string;
        city: string;
        county: string;
        postcode: string;
    };
}

export const OrganizationValidation = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string().required(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        postcode: Joi.string().required(),
    }).required(),
};

const OrganizationSchema: Schema<OrganizationProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            line1: {
                type: String,
                required: true,
            },
            line2: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            county: {
                type: String,
                required: true,
            },
            postcode: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true },
);

const Organization = tenantlessModel<OrganizationProps>('Organization', OrganizationSchema);

export { Organization };
