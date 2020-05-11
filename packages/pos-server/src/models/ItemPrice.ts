import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface ItemPriceProps {
    _id?: mongoose.Types.ObjectId;
    groupId: mongoose.Types.ObjectId;
    amount: number;
}

export const ItemPriceSubSchema: Schema<ItemPriceProps> = new Schema({
    groupId: { type: Schema.Types.ObjectId, ref: 'PriceGroup' },
    amount: {
        type: Number,
        required: true,
    },
});
