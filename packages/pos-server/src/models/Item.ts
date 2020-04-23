import { Schema } from 'mongoose';
import { ItemPriceGroupProps } from './PriceGroup';
import { tenantModel } from './utils/multiTenant';

interface ItemProps {
    name: string;
    categoryId: string;
    price: ItemPriceGroupProps[];
    stock?: number;
    modifierId?: string;
}

const ItemSchema: Schema<ItemProps> = new Schema(
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

const Item = tenantModel<ItemProps>('Item', ItemSchema);

export { Item };
