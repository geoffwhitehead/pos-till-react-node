import { model, Schema, Document } from 'mongoose';

interface CategoryProps {
    name: string;
}

export interface CategoryDocument extends Document, CategoryProps {}

const CategorySchema: Schema<CategoryDocument> = new Schema({
    name: {
        type: String,
        required: true,
    },
});

const Category = model<CategoryDocument>('Category', CategorySchema);

export { Category };
