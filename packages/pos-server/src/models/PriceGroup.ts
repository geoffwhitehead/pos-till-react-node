import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PriceGroupProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
}

const PriceGroupSchema: Schema<PriceGroupProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const PriceGroup = tenantModel<PriceGroupProps>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
