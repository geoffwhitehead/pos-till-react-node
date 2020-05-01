import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PrinterProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    type?: string;
    address?: string;
}

const PrinterSchema: Schema<PrinterProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
    },
    address: {
        type: String,
    },
});

const Printer = tenantModel<PrinterProps>('Printer', PrinterSchema);

export { Printer };
