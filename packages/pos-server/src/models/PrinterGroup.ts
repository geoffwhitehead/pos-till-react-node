import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import uuid from 'uuid';

export interface PrinterGroupProps {
    _id?: string;
    name: string;
    // printers: string[];
}

export const PRINTER_GROUP_COLLECTION_NAME = 'printer_groups';

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
        // printers: [{ type: String, ref: 'Printer' }],
    },
    { timestamps: true, collection: PRINTER_GROUP_COLLECTION_NAME },
);

const PrinterGroup = tenantModel<PrinterGroupProps>('PrinterGroup', PrinterGroupSchema);

export { PrinterGroup };
