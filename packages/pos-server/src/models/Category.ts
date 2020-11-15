import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface CategoryProps {
    _id?: string;
    name: string;
    shortName: string;
    backgroundColor?: string;
    textColor?: string;
    positionIndex?: number;
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
            default: 10,
        },
        backgroundColor: {
            type: String,
            default: '#2FA8F6',
        },
        textColor: {
            type: String,
            default: '#FFFFFF',
        },
        positionIndex: {
            type: Number,
        },
    },
    { timestamps: true, collection: CATEGORY_COLLECTION_NAME },
);

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
