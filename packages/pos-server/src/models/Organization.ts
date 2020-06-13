import mongoose, { Schema } from 'mongoose';
import { tenantlessModel } from './utils/multiTenant';
import { Joi } from 'celebrate';

export interface OrganizationProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    email: string;
    phone: string;
    vat?: string;
    settings?: {
        defaultPriceGroup?: mongoose.Types.ObjectId;
        receiptPrinter?: mongoose.Types.ObjectId;
        currency: string,
        maxBills: number
    };
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
    vat: Joi.string(),
    settings: Joi.object({
        defaultPriceGroup: Joi.string(),
        receiptPrinter: Joi.string(),
        currency: Joi.string(),
        maxBills: Joi.number()
    }),
    address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string(),
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
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
        },
        vat: {
            type: String,
        },
        settings: {
            type: {
                defaultPriceGroup: { type: Schema.Types.ObjectId, ref: 'PriceGroup' },
                receiptPrinter: { type: Schema.Types.ObjectId, ref: 'Printer' },
                currency: String,
                maxBills: Number
            },
            default: {}
        },
        address: {
            type: {
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
            required: true,
        },
    },
    { timestamps: true },
);

const Organization = tenantlessModel<OrganizationProps>('Organization', OrganizationSchema);

export { Organization };
