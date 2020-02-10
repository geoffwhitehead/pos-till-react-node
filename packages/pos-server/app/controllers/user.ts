import { User } from '../models';
import { APIError, parseSkipLimit } from '../helpers';

/**
 * Validate the POST req body and create a new User
 */
const createUser = async (req, res, next) => {
    const user = new User(req.body);
    const errors = user.validateSync();

    if (errors) {
        return next(new APIError(400, 'Bad req', errors));
    }

    try {
        await user.save();
        return res.status(201).json(user);
    } catch (err) {
        return next(err);
    }
};

/**
 * Get a single user
 * @param {String} name - the name of the User to retrieve
 */
const readUser = async (req, res, next) => {
    const { name } = req.params;
    try {
        const user = await User.findOne(name);
        return res.send(user);
    } catch (err) {
        return next(err);
    }
};

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
async function readUsers(req, res, next) {
    const skip = parseSkipLimit(req.query.skip) || 0;
    const limit = parseSkipLimit(req.query.limit, 1000) || 1000;
    if (skip instanceof APIError) {
        return next(skip);
    } else if (limit instanceof APIError) {
        return next(limit);
    }

    try {
        const users = await User.find({}, {}, { skip, limit });
        return res.send(users);
    } catch (err) {
        return next(err);
    }
}

/**
 * Update a single user
 * @param {String} name - the name of the User to update
 */
const updateUser = async (req, res, next) => {
    const { id, ...props } = req.body;
    try {
        const user = await User.updateOne(id, props, { runValidators: true });
        return res.send(user);
    } catch (err) {
        return next(err);
    }
};

/**
 * Remove a single user
 * @param {String} name - the name of the User to remove
 */
const deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const deleteMsg = await User.deleteOne(id);
        return res.send(deleteMsg);
    } catch (err) {
        return next(err);
    }
};

export { createUser, readUser, readUsers, updateUser, deleteUser };
