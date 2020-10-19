import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface ItemPriceProps {
    _id?: string;
    priceGroupId: string;
    itemId: string;
    price: number;
}

export const ItemPriceSchema: Schema<ItemPriceProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        priceGroupId: { type: String, ref: 'PriceGroup' },
        price: {
            type: Number,
            required: true,
        },
        itemId: { type: String, ref: 'Item' },
    },
    { timestamps: true },
);

const ItemPrice = tenantModel<ItemPriceProps>('ItemPrice', ItemPriceSchema);

export { ItemPrice };
