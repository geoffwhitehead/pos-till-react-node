import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PrinterProps {
    _id?: string;
    name: string;
    type: string;
    address: string;
}

const PrinterSchema: Schema<PrinterProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const Printer = tenantModel<PrinterProps>('Printer', PrinterSchema);

export { Printer };
