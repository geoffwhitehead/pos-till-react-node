import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PriceGroupProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    shortName?: string;
}

const PriceGroupSchema: Schema<PriceGroupProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        shortName: {
            type: String,
            maxlength: 10,
        }
    },
    { timestamps: true },
);

const PriceGroup = tenantModel<PriceGroupProps>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
