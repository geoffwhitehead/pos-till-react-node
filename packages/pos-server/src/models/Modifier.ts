import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { ModifierItemProps } from './ModifierItem';
import uuid from 'uuid';

export interface ModifierProps {
    _id?: string;
    name: string;
    maxItems: number;
    minItems: number;
    // items: ModifierItemProps[];
}

const ModifierSchema: Schema<ModifierProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        name: {
            type: String,
            required: true,
        },
        maxItems: {
            type: Number,
            default: 1,
        },
        minItems: {
            type: Number,
            default: 1,
        },
        // items: [ModifierItemSubSchema],
    },
    { timestamps: true },
);

const Modifier = tenantModel<ModifierProps>('Modifier', ModifierSchema);

export { Modifier };
