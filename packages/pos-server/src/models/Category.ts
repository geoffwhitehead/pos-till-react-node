import { Schema } from 'mongoose';
import { tenantModel } from '../services/multiTenant';

interface CategoryProps {
    name: string;
}

const CategorySchema: Schema<CategoryProps> = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const Category = tenantModel<CategoryProps>('Category', CategorySchema);

export { Category };
