import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface ModifierPriceProps {
    _id?: string;
    price: number;
    priceGroupId: string;
    modifierItemId: string;
    // price: ItemPriceProps[];
}

export const MODIFIER_PRICE_COLLECTION_NAME = 'modifier_prices';

export const ModifierPriceSchema: Schema<ModifierPriceProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        price: {
            type: Number,
            required: true,
        },
        priceGroupId: { type: String, ref: 'PriceGroup' },
        modifierItemId: { type: String, ref: 'ModifierItem' },
        // price: [ItemPriceSubSchema],
    },
    { timestamps: true, collection: MODIFIER_PRICE_COLLECTION_NAME },
);

const ModifierPrice = tenantModel<ModifierPriceProps>('ModifierPrice', ModifierPriceSchema);

export { ModifierPrice };
