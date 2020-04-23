import { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface DiscountProps {
    name: string;
    amount: number;
    isPercent: boolean;
}

const DiscountSchema: Schema<DiscountProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
    },
    isPercent: {
        type: Boolean,
        default: true,
    },
});

const Discount = tenantModel<DiscountProps>('Discount', DiscountSchema);

export { Discount };
