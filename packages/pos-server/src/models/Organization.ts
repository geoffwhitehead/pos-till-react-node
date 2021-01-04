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
    settings: OrganizationSettings;
    address: {
        line1: string;
        line2?: string;
        city: string;
        county: string;
        postcode: string;
    };
}

export interface OrganizationSettings {
    defaultPriceGroupId?: string;
    receiptPrinterId?: string;
    currency?: CurrencyEnum;
    maxBills?: number;
    shortNameLength?: number;
    maxDiscounts?: number;
    gracePeriodMinutes?: number;
    categoryGridSize?: number;
    categoryViewType?: CategoryViewTypeEnum;
    tranactionGrouping?: TransactionGroupingEnum;
    transactionOrder?: TransactionOrderEnum;
    billViewPlanGridSize?: number;
    billViewType?: BillViewTypeEnum;
    accessPin?: string;
    accessPinEnabled?: boolean;
    printItemGrouping?: PrintItemGroupingEnum;
}

export const ORGANIZATION_COLLECTION_NAME = 'organizations';

export const OrganizationValidation = {
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    vat: Joi.string(),
    address: Joi.object({
        line1: Joi.string(),
        line2: Joi.string(),
        city: Joi.string(),
        county: Joi.string(),
        postcode: Joi.string(),
    }),
};

export enum PrintItemGroupingEnum {
    printCategory = 'printCategory',
    category = 'category',
}

export enum BillViewTypeEnum {
    list = 'list',
    plan = 'plan',
}

export enum TransactionOrderEnum {
    descending = 'descending',
    ascending = 'ascending',
}

export enum TransactionGroupingEnum {
    grouped = 'grouped',
    ungrouped = 'ungrouped',
}

export enum CurrencyEnum {
    gbp = 'gbp',
}

export enum CategoryViewTypeEnum {
    list = 'list',
    grid = 'grid',
}

const OrganizationSettingsSchema: Schema<OrganizationSettings> = new Schema({
    defaultPriceGroupId: { type: String, ref: 'PriceGroup' },
    receiptPrinterId: { type: String, ref: 'Printer' },
    currency: {
        type: String,
        enum: Object.values(CurrencyEnum),
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
    categoryViewType: {
        type: String,
        enum: Object.values(CategoryViewTypeEnum),
        default: CategoryViewTypeEnum.grid,
    },
    billViewPlanGridSize: {
        type: Number,
        default: 15,
    },
    billViewType: {
        type: String,
        enum: Object.values(BillViewTypeEnum),
        default: BillViewTypeEnum.plan,
    },
    transactionOrder: {
        type: String,
        enum: Object.values(TransactionOrderEnum),
        default: TransactionOrderEnum.descending,
    },
    transactionGrouping: {
        type: String,
        enum: Object.values(TransactionGroupingEnum),
        default: TransactionGroupingEnum.ungrouped,
    },
    accessPin: {
        type: String,
        default: '5555',
    },
    accessPinEnabled: {
        type: Boolean,
        default: false,
    },
    printItemGrouping: {
        type: String,
        enum: Object.values(PrintItemGroupingEnum),
        default: PrintItemGroupingEnum.printCategory,
    },
});

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
            type: OrganizationSettingsSchema,
            default: () => ({}),
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
