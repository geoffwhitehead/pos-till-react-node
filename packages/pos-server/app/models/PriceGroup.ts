import { model, Schema, Document } from 'mongoose';

export interface ItemPriceGroupProps {
    groupId: string;
    amount: number;
}

interface PriceGroupProps {
    name: string;
}

export interface PriceGroupDocument extends Document, PriceGroupProps {}

const PriceGroupSchema: Schema<PriceGroupDocument> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const PriceGroup = model<PriceGroupDocument>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
