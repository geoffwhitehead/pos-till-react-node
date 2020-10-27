import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface ItemProps {
    _id?: string;
    name: string;
    shortName: string;
    categoryId: string;
    printerGroupId?: string;
    // price: ItemPriceProps[];
    // stock?: number;
    // modifiers?: mongoose.Types.ObjectId[];
}
export const ITEM_COLLECTION_NAME = 'items';

const ItemSchema: Schema<ItemProps> = new Schema(
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
        printerGroupId: { type: String, ref: 'PrinterGroup' },
        categoryId: { type: String, ref: 'Category' },
        // price: [ItemPriceSubSchema],
        // modifiers: [
        //     {
        //         type: Schema.Types.ObjectId,
        //         ref: 'Modifier',
        //         default: [],
        //     },
        // ],
    },
    { timestamps: true, collection: ITEM_COLLECTION_NAME },
);

const Item = tenantModel<ItemProps>('Item', ItemSchema);

export { Item };
