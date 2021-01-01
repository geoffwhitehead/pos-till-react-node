import { Schema } from 'mongoose';
import uuid from 'uuid';
import { tenantModel } from './utils/multiTenant';

export interface PaymentTypeProps {
    _id?: string;
    name: string;
    displayOrder?: string;
}

export const PAYMENT_TYPE_COLLECTION_NAME = 'payment_types';

const PaymentTypeSchema: Schema<PaymentTypeProps> = new Schema(
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
        displayOrder: {
            type: Number,
            default: 10,
        },
    },
    { timestamps: true, collection: PAYMENT_TYPE_COLLECTION_NAME },
);

const PaymentType = tenantModel<PaymentTypeProps>('PaymentType', PaymentTypeSchema);

export { PaymentType };
