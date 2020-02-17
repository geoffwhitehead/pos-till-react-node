import { model, Schema, Document } from 'mongoose';

interface DiscountProps {
    name: string;
    amount: number;
    type: string;
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
    type: {
        type: String,
    },
});

const Discount = model<DiscountDocument>('Discount', DiscountSchema);

export { Discount };
