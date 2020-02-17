import { model, Schema, Document } from 'mongoose';

interface ModSchema {
    name: string;
    price: number;
}

interface ModifierProps {
    name: string;
    mods: [ModSchema];
}

const ModSchema: Schema<ModSchema> = new Schema({
    name: String,
    price: Number,
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
            items: [
                {
                    name: String,
                    price: Number,
                },
            ],
        },
    },
    { timestamps: true },
);

const Modifier = model<ModifierDocument>('Modifier', ModifierSchema);

export { Modifier };
