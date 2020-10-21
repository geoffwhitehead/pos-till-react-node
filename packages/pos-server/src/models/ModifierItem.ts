import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import { ItemPriceProps } from './ItemPrice';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface ModifierItemProps {
    _id?: string;
    name: string;
    shortName: string;
    modifierId: string;
    // price: ItemPriceProps[];
}

export const MODIFIER_ITEM_COLLECTION_NAME = 'modifier_items';

export const ModifierItemSchema: Schema<ModifierItemProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        name: String,
        shortName: {
            type: String,
            maxlength: 10,
        },
        modifierId: {
            type: String,
            ref: 'Modifier',
        },
        // price: [ItemPriceSubSchema],
    },
    { timestamps: true, collection: MODIFIER_ITEM_COLLECTION_NAME },
);

const ModifierItem = tenantModel<ModifierItemProps>('ModifierItem', ModifierItemSchema);

export { ModifierItem };
