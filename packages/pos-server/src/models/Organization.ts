import { Schema } from 'mongoose';
import { tenantlessModel } from '../services/multiTenant';

interface OrganizationProps {
    name: string;
}

const OrganizationSchema: Schema<OrganizationProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            line1: {
                type: String,
                required: true,
            },
            line2: {
                type: String,
            },
            city: {
                type: String,
                required: true,
            },
            county: {
                type: String,
                required: true,
            },
            postcode: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true },
);

const Organization = tenantlessModel<OrganizationProps>('Organization', OrganizationSchema);

export { Organization };
