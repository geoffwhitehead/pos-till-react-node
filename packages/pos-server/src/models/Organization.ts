import { Joi } from 'celebrate';
import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantlessModel } from './utils/multiTenant';

export interface OrganizationProps {
    _id?: string;
    id?: string;
    name: string;
    email: string;
    phone: string;
    vat?: string;
    settings: {
        defaultPriceGroupId?: string;
        receiptPrinterId?: string;
        currency?: string;
        maxBills?: number;
        shortNameLength?: number;
        maxDiscounts?: number;
        gracePeriodMinutes?: number;
        categoryGridSize?: number;
    };
    address: {
        line1: string;
        line2?: string;
        city: string;
        county: string;
        postcode: string;
    };
}

export const ORGANIZATION_COLLECTION_NAME = 'organizations';

export const OrganizationValidation = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    vat: Joi.string(),
    settings: Joi.object({
        defaultPriceGroupId: Joi.string(),
        receiptPrinterId: Joi.string(),
        currency: Joi.string(),
        maxBills: Joi.number(),
    }),
    address: Joi.object({
        line1: Joi.string().required(),
        line2: Joi.string(),
        city: Joi.string().required(),
        county: Joi.string().required(),
        postcode: Joi.string().required(),
    }).required(),
};

export enum CurrencyEnum {
    gbp = 'gbp',
}

const OrganizationSchema: Schema<OrganizationProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
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
                defaultPriceGroupId: { type: String, ref: 'PriceGroup' },
                receiptPrinterId: { type: String, ref: 'Printer' },
                currency: {
                    type: String,
                    enum: CurrencyEnum,
                    default: CurrencyEnum.gbp,
                },
                maxBills: {
                    type: Number,
                    default: 10,
                },
                shortNameLength: {
                    type: Number,
                    default: 10,
                },
                maxDiscounts: {
                    type: Number,
                    default: 10,
                },
                gracePeriodMinutes: {
                    type: Number,
                    default: 5,
                },
                categoryGridSize: {
                    type: Number,
                    default: 3,
                },
            },
            default: {},
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
        lastPulledAt: {
            type: Date,
        },
    },
    { timestamps: true, collection: ORGANIZATION_COLLECTION_NAME },
);

const Organization = tenantlessModel<OrganizationProps>('Organization', OrganizationSchema);

export { Organization };
