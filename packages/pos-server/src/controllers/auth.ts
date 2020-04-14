import { User } from '../models';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { createToken } from '../helpers/createToken';

const authenticate = async (email, password) => {
    // Search for a user by email and password.
    const user = await User.findOne({ email });
    console.log('user', user);
    if (!user) {
        throw new Error('Invalid login credentials');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log('isPasswordMatch', isPasswordMatch);
    if (!isPasswordMatch) {
        throw new Error('Invalid login credentials');
    }
    return user;
};

const hashPassword = (password: string) => bcrypt.hashSync(password, 8);

const isPasswordValid = (hashedPassword, unencryptedPassword: string) =>
    bcrypt.compareSync(unencryptedPassword, hashedPassword);

export const login = async (req: Request, res: Response) => {
    //Login a registered user
    //Check if username and password are set
    const { email, password } = req.body;

    if (!(email && password)) {
        res.status(400).send('Missing email / password');
    }

    try {
        const user = await authenticate(email, password);
        const token = createToken(user.id, user.email);

        await User.findByIdAndUpdate(user.id, { token });
        //Send the jwt in the response
        res.send(token);
    } catch (error) {
        res.status(401).send(error);
    }
};

export const changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const id = res.locals.jwtPayload.userId;

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
        res.status(400).send();
    }

    //Get user from the database
    try {
        const user = await User.findById(id);
        if (isPasswordValid(user.password, oldPassword)) {
            res.status(401).send();
            return;
        }
        await user.update({ password: hashPassword(newPassword) });
        res.status(204).send();
    } catch (err) {
        res.status(500).send(err);
    }
};
