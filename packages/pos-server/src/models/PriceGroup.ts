import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface ItemPriceGroupProps {
    _id?: string;
    groupId: string;
    price: number;
}

export interface PriceGroupProps {
    _id?: string;
    name: string;
}

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
