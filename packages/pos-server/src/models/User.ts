import { model, Schema, Document } from 'mongoose';
import validator from 'validator';

interface UserProps {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    token: string;
}

export interface UserDocument extends Document, UserProps {}

const UserSchema: Schema<UserDocument> = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            // validate: (value: string): boolean => {
            //     if (!validator.isEmail(value)) {
            //         return false;
            //     }
            //     return true;
            // },
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
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true,
    },
);

const User = model<UserDocument>('User', UserSchema);

export { User };
