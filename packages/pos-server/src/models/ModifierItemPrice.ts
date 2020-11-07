import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface ModifierItemPriceProps {
    _id?: string;
    price: number;
    priceGroupId: string;
    modifierItemId: string;
}

export const MODIFIER_ITEM_PRICE_COLLECTION_NAME = 'modifier_item_prices';

export const ModifierItemPriceSchema: Schema<ModifierItemPriceProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        price: {
            // this field can be set to null by a user when they dont want the item to appear in this price group
            type: Number,
        },
        priceGroupId: { type: String, ref: 'PriceGroup' },
        modifierItemId: { type: String, ref: 'ModifierItem' },
    },
    { timestamps: true, collection: MODIFIER_ITEM_PRICE_COLLECTION_NAME },
);

const ModifierItemPrice = tenantModel<ModifierItemPriceProps>('ModifierItemPrice', ModifierItemPriceSchema);

export { ModifierItemPrice };
