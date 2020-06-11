import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';

export interface CategoryProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    shortName: string;
    linkedPrinters: PrinterProps[];
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
    linkedPrinters: [{ groupId: { type: Schema.Types.ObjectId, ref: 'Printer' }, default: [] }],
});

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
