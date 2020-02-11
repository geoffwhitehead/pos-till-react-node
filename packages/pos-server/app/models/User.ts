/*eslint no-unused-vars: 2*/
import { model, Schema, Model, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
interface UserProps extends Document, UserMethods {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    tokens: [string];
}

interface UserMethods {
    generateAuthToken: () => Promise<string>;
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
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
    date: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', async next => {
    // Hash the password before saving the user model
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async () => {
    // Generate an auth token for the user
    const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

const User: Model<UserProps> = model('User', userSchema);

export { User };
