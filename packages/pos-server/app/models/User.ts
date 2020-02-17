import { model, Schema, Document } from 'mongoose';
import validator from 'validator';

interface UserProps {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    token: string;
}

export interface UserDocument extends Document, UserProps {}

const UserSchema: Schema<UserDocument> = new Schema(
    {
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
    },
    { timestamps: true },
);

const User = model<UserDocument>('User', UserSchema);

export { User };
