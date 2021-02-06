import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface PriceGroupProps {
    _id?: string;
    name: string;
    shortName?: string;
    isPrepTimeRequired?: boolean;
}

export const PRICE_GROUP_COLLECTION_NAME = 'price_groups';

const PriceGroupSchema: Schema<PriceGroupProps> = new Schema(
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
        shortName: {
            type: String,
            maxlength: 10,
        },
        isPrepTimeRequired: {
            type: Boolean,
            default: false,
        },
        color: {
            type: String,
            required: false,
        },
    },
    { timestamps: true, collection: PRICE_GROUP_COLLECTION_NAME },
);

const PriceGroup = tenantModel<PriceGroupProps>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
