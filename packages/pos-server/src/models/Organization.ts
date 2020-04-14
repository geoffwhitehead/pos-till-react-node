import { model, Schema, Document } from 'mongoose';

interface OrganizationProps {
    name: string;
}

export interface OrganizationDocument extends Document, OrganizationProps {}

const OrganizationSchema: Schema<OrganizationDocument> = new Schema(
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

const Organization = model<OrganizationDocument>('Organization', OrganizationSchema);

export { Organization };
