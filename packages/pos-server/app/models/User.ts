/*eslint no-unused-vars: 2*/
import { model, Schema, Document } from 'mongoose';
import validator from 'validator';
/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
interface UserProps {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    token: string;
}

interface UserMethods {
    authenticate: (email: string, password: string) => Promise<UserProps>;
}

export interface UserModelProps extends Document, UserProps, UserMethods {}

const userSchema: Schema<UserModelProps> = new Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: (value: string): boolean => {
            if (!validator.isEmail(value)) {
                return false;
            }
            return true;
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
    },
    token: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const User = model<Document & UserModelProps>('User', userSchema);

export { User };
