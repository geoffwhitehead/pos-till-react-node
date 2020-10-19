import mongoose, { Schema } from 'mongoose';
import { tenantlessModel } from './utils/multiTenant';
import { Joi } from 'celebrate';
import uuid from 'uuid';
import { Timestamp } from 'mongodb';

export interface OrganizationProps {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    vat?: string;
    settings?: {
        defaultPriceGroup?: string;
        receiptPrinter?: string;
        currency: string;
        maxBills: number;
    };
    address: {
        line1: string;
        line2?: string;
        city: string;
        county: string;
        postcode: string;
    };
    syncId: string;
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
                defaultPriceGroup: { type: String, ref: 'PriceGroup' },
                receiptPrinter: { type: String, ref: 'Printer' },
                currency: String,
                maxBills: Number,
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
    { timestamps: true },
);

const Organization = tenantlessModel<OrganizationProps>('Organization', OrganizationSchema);

export { Organization };
