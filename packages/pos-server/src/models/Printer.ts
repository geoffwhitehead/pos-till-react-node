import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PrinterProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    type?: 'wifi' | 'ethernet';
    address?: string;
    printWidth: number;
    emulation: 'StarPRNT' | 'StarLine' | 'StarGraphic' | 'StarDotImpact' | 'EscPosMobile' | 'EscPos';
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
    emulation: {
        type: String,
    },
    printWidth: {
        type: Number,
    }
});

const Printer = tenantModel<PrinterProps>('Printer', PrinterSchema);

export { Printer };
