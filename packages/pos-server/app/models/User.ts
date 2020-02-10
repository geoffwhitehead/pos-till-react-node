/*eslint no-unused-vars: 2*/
import { model, Schema, Model, Document } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
export interface UserProps extends Document {
    email: string;
    password: string;
    avatar: string;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const User: Model<UserProps> = model('User', userSchema);

export { User };
