import { Schema } from 'mongoose';
import { ItemPriceGroupProps } from './PriceGroup';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';

export interface ItemProps {
    _id?: string;
    name: string;
    categoryId: string;
    price: ItemPriceGroupProps[];
    stock?: number;
    modifierId?: string;
    linkedPrinters: PrinterProps[];
}

const ItemSchema: Schema<ItemProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        linkedPrinters: [{ groupId: { type: Schema.Types.ObjectId, ref: 'Printer' }, default: [] }],
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
