import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface PrinterProps {
    _id?: string;
    name: string;
    type?: 'wifi' | 'ethernet';
    address?: string;
    macAddress?: string;
    printWidth: number;
    emulation: 'StarPRNT' | 'StarLine' | 'StarGraphic' | 'StarDotImpact' | 'EscPosMobile' | 'EscPos';
}

export const PRINTER_COLLECTION_NAME = 'printers';

const PrinterSchema: Schema<PrinterProps> = new Schema(
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
        type: {
            type: String,
        },
        address: {
            type: String,
        },
        macAddress: {
            type: String,
        },
        emulation: {
            type: String,
        },
        printWidth: {
            type: Number,
        },
    },
    { timestamps: true, collection: PRINTER_COLLECTION_NAME },
);

const Printer = tenantModel<PrinterProps>('Printer', PrinterSchema);

export { Printer };
