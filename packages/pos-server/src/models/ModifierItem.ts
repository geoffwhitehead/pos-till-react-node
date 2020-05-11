import { Schema } from 'mongoose';
import mongoose from 'mongoose';
import { ItemPriceProps, ItemPriceSubSchema } from './ItemPrice';

export interface ModifierItemProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    price: ItemPriceProps[];
}

export const ModifierItemSubSchema: Schema<ModifierItemProps> = new Schema({
    name: String,
    price: [ItemPriceSubSchema],
});

