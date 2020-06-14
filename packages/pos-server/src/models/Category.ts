import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';

export interface CategoryProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    shortName: string;
}

const CategorySchema: Schema<CategoryProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String,
        maxlength: 10,
    },
});

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
