import { Schema, Document, model } from 'mongoose';
import { tenantModel } from '../services/multiTenant';

interface TestProps {
    name: string;
}

export interface TestDocument extends Document, TestProps {
    name: string;
}

const TestSchema: Schema<TestProps> = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

const Test = tenantModel<TestProps>('Test', TestSchema);

export { Test };
