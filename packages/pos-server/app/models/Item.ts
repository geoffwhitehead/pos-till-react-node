import { model, Schema, Document } from 'mongoose';

interface ItemProps {
    name: string;
    categoryId: string;
    price: ItemPriceGroupProps[];
    stock?: number;
    modifierId?: string;
}

interface ItemPriceGroupProps {
    groupId: string;
    amount: number;
}

export interface ItemDocument extends Document, ItemProps {}

const ItemSchema: Schema<ItemDocument> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
        price: [{ groupId: { type: Schema.Types.ObjectId, ref: 'PriceGroup' }, amount: { type: 'Number' } }],
        modifierId: {
            type: Schema.Types.ObjectId,
            ref: 'Modifier',
        },
    },
    { timestamps: true },
);

ItemSchema.path('price').get(function(num) {
    return (num / 100).toFixed(2);
});

ItemSchema.path('price').set(function(num) {
    return num * 100;
});

const Item = model<ItemDocument>('Item', ItemSchema);

export { Item };
