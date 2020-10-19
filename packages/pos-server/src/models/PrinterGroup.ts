import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';
import uuid from 'uuid';

export interface PrinterGroupProps {
    _id?: string;
    name: string;
    printers: string[];
}

const PrinterGroupSchema: Schema<PrinterGroupProps> = new Schema(
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
        printers: [{ type: String, ref: 'Printer' }],
    },
    { timestamps: true },
);

const PrinterGroup = tenantModel<PrinterGroupProps>('PrinterGroup', PrinterGroupSchema);

export { PrinterGroup };
