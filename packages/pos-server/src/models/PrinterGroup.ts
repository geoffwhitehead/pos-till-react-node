import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';
import { PrinterProps } from './Printer';

export interface PrinterGroupProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    printers: mongoose.Types.ObjectId[],
}

const PrinterGroupSchema: Schema<PrinterGroupProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
    printers: [{ type: Schema.Types.ObjectId, ref: 'Printer' }]
});

const PrinterGroup = tenantModel<PrinterGroupProps>('PrinterGroup', PrinterGroupSchema);

export { PrinterGroup };
