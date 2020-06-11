import mongoose, { Schema } from 'mongoose';
import { tenantModel } from './utils/multiTenant';

export interface PriceGroupProps {
    _id?: mongoose.Types.ObjectId;
    name: string;
    shortName?: string;
    isPrepTimeRequired: boolean
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
        },
        isPrepTimeRequired: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);

const PriceGroup = tenantModel<PriceGroupProps>('PriceGroup', PriceGroupSchema);

export { PriceGroup };
