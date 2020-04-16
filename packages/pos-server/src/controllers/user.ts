import { User } from '../models';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { createToken } from '../helpers/createToken';

const PUBLIC_FIELDS = 'firstName lastName email';

const create = async (req: Request, res: Response): Promise<void> => {
    const UserModel = User();

    const user = new UserModel(req.body);
    const errors = user.validateSync(req.body);

    if (errors) {
        res.status(401).send(errors);
        return;
    }

    const duplicate = await UserModel.find({ email: req.body.email });

    if (duplicate) {
        res.status(400).send('User exists');
        return;
    }

    try {
        user.password = await bcrypt.hash(req.body.password, 8);
        user.token = createToken(user.id, user.email);
        await user.save();
        res.status(201).send(user.token);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Get a single user
 * @param {String} name - the name of the User to retrieve
 */
const getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const user = await User().findById(id, PUBLIC_FIELDS);
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
const getAll = async (req: Request, res: Response): Promise<void> => {
    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const users = await User().find({}, 'firstName lastName email', { skip, limit });

        res.status(200).send(users);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Update a single user
 * @param {String} name - the name of the User to update
 */
const update = async (req: Request, res: Response): Promise<void> => {
    const { id, ...props } = req.body;
    try {
        const user = await User().updateOne(id, props, { runValidators: true });

        if (user.err) {
            throw new Error('Errors creating user');
        }
        res.send('user updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Remove a single user
 * @param {String} name - the name of the User to remove
 */
const remove = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const deleteMsg = await User().deleteOne(id);
        res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
