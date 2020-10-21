import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface CategoryProps {
    _id?: string;
    name: string;
    shortName: string;
}

export const CATEGORY_COLLECTION_NAME = 'categories';

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
    { timestamps: true, collection: CATEGORY_COLLECTION_NAME },
);

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
