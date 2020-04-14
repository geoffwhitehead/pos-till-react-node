import { model, Schema, Document } from 'mongoose';
import { ItemPriceGroupProps } from './PriceGroup';

interface ModSchema {
    name: string;
    price: ItemPriceGroupProps[];
}

interface ModifierProps {
    name: string;
    mods: [ModSchema];
}

const ModSchema: Schema<ModSchema> = new Schema({
    name: String,
    price: [{ groupId: { type: Schema.Types.ObjectId, ref: 'PriceGroup' }, amount: { type: 'Number' } }],
});

ModSchema.path('price').get(function(num) {
    return (num / 100).toFixed(2);
});

ModSchema.path('price').set(function(num) {
    return num * 100;
});

export interface ModifierDocument extends Document, ModifierProps {}

const ModifierSchema: Schema<ModifierDocument> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        mods: {
            type: Array,
            items: [ModSchema],
        },
    },
    { timestamps: true },
);

const Modifier = model<ModifierDocument>('Modifier', ModifierSchema);

export { Modifier };
