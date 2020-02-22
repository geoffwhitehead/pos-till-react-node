import { model, Schema, Document } from 'mongoose';

interface DiscountProps {
    name: string;
    amount: number;
    isPercent: boolean;
}

export interface DiscountDocument extends Document, DiscountProps {}

const DiscountSchema: Schema<DiscountDocument> = new Schema({
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

const Discount = model<DiscountDocument>('Discount', DiscountSchema);

export { Discount };
