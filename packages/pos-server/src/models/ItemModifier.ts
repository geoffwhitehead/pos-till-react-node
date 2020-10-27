import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface ItemModifierProps {
    _id?: string;
    modifierId: string;
    itemId: string;
}

export const ITEM_MODIFIER_COLLECTION_NAME = 'item_modifiers';

export const ItemModifierSchema: Schema<ItemModifierProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        modifierId: { type: String, ref: 'Modifier' },
        itemId: { type: String, ref: 'Item' },
    },
    { timestamps: true, collection: ITEM_MODIFIER_COLLECTION_NAME },
);

const ItemModifier = tenantModel<ItemModifierProps>('ItemModifier', ItemModifierSchema);

export { ItemModifier };
