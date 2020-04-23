import { Schema, Document } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface ItemPriceGroupProps {
    _id?: string;
    groupId: string;
    price: number;
}

export interface PriceGroupProps {
    name: string;
}

export interface PriceGroupDocument extends PriceGroupProps, Document {}
const PriceGroupSchema: Schema<PriceGroupProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const PriceGroup = tenantModel<PriceGroupProps>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
