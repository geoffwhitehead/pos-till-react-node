import mongoose, { Schema, Mongoose } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { ItemPriceSubSchema, ItemPriceProps } from './ItemPrice';

export interface ItemProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    categoryId: mongoose.Types.ObjectId;
    price: ItemPriceProps[];
    stock?: number;
    modifiers?: mongoose.Types.ObjectId[];
    linkedPrinters: mongoose.Types.ObjectId[];
}

const ItemSchema: Schema<ItemProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        linkedPrinters: [{ type: Schema.Types.ObjectId, ref: 'Printer' }],
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
        price: [ItemPriceSubSchema],
        modifiers: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Modifier',
                default: [],
            },
        ],
    },
    { timestamps: true },
);

// ItemSchema.path('price').get(function(num) {
//     return (num / 100).toFixed(2);
// });

// ItemSchema.path('price').set(function(num) {
//     return num * 100;
// });

const Item = tenantModel<ItemProps>('Item', ItemSchema);

export { Item };
