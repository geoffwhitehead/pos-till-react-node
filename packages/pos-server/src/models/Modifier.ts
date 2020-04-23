import { Schema } from 'mongoose';
import { ItemPriceGroupProps } from './PriceGroup';
import { tenantModel } from './utils/multiTenant';

interface ModifierItemProps {
    name: string;
    price: ItemPriceGroupProps[];
}

interface ModifierProps {
    name: string;
    mods: [ModifierItemProps];
}

const ModSchema: Schema<ModifierItemProps> = new Schema({
    name: String,
    price: [{ groupId: { type: Schema.Types.ObjectId, ref: 'PriceGroup' }, amount: { type: 'Number' } }],
});

ModSchema.path('price').get(function(num) {
    return (num / 100).toFixed(2);
});

ModSchema.path('price').set(function(num) {
    return num * 100;
});

const ModifierSchema: Schema<ModifierProps> = new Schema(
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

const Modifier = tenantModel<ModifierProps>('Modifier', ModifierSchema);

export { Modifier };
