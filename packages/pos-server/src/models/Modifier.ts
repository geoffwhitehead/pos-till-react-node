import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { ModifierItemSubSchema, ModifierItemProps } from './ModifierItem';

export interface ModifierProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    items: ModifierItemProps[];
}

const ModifierSchema: Schema<ModifierProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        maxItems: {
            type: Number,
            default: 1
        },
        minItems: {
            type: Number,
            default: 1
        },
        items: [ModifierItemSubSchema],
    },
    { timestamps: true },
);

const Modifier = tenantModel<ModifierProps>('Modifier', ModifierSchema);

export { Modifier };
