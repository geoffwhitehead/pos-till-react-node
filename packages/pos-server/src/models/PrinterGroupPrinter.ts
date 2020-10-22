import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';
import uuid from 'uuid';

export interface PrinterGroupPrinterProps {
    _id?: string;
    printerGroupId: string;
    printerId: string;
}

export const PRINTER_GROUP_PRINTER_COLLECTION_NAME = 'printer_groups_printers';

const PrinterGroupPrinterSchema: Schema<PrinterGroupPrinterProps> = new Schema(
    {
        _id: {
            type: String,
            alias: 'id',
            default: uuid,
        },
        printerGroupId: {
            type: String,
            ref: 'PrinterGroup',
            required: true,
        },
        printerId: {
            type: String,
            ref: 'Printer',
            required: true,
        },
    },
    { timestamps: true, collection: PRINTER_GROUP_PRINTER_COLLECTION_NAME },
);

const PrinterGroupPrinter = tenantModel<PrinterGroupPrinterProps>('PrinterGroupPrinter', PrinterGroupPrinterSchema);

export { PrinterGroupPrinter };
