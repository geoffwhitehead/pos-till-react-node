import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface PrintCategoryProps {
    _id?: string;
    name: string;
    shortName?: string;
    displayOrder?: number;
}

export const PRINT_CATEGORY_COLLECTION_NAME = 'print_categories';

const PrintCategorySchema: Schema<PrintCategoryProps> = new Schema(
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
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, collection: PRINT_CATEGORY_COLLECTION_NAME },
);

const PrintCategory = tenantModel<PrintCategoryProps>('PrintCategory', PrintCategorySchema);

export { PrintCategory };
