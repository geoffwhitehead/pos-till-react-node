import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface CategoryProps {
    _id?: string;
    name: string;
    shortName: string;
}

const CategorySchema: Schema<CategoryProps> = new Schema(
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
        shortName: {
            type: String,
            maxlength: 10,
        },
    },
    { timestamps: true },
);

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
