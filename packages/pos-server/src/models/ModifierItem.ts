import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import { ItemPriceProps, ItemPriceSubSchema } from './ItemPrice';

export interface ModifierItemProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    shortName: string;
    price: ItemPriceProps[];
}

export const ModifierItemSubSchema: Schema<ModifierItemProps> = new Schema({
    name: String,
    shortName: {
        type: String,
        maxlength: 10,
    },
    price: [ItemPriceSubSchema],
});
