import { Schema } from 'mongoose';
import { tenantlessModel } from './utils/multiTenant';
import uuid from 'uuid';

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
    { collection: PAYMENT_TYPE_COLLECTION_NAME },
);

const PaymentType = tenantlessModel<PaymentTypeProps>('PaymentType', PaymentTypeSchema);

export { PaymentType };
