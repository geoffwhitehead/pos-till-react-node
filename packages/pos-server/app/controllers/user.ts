import { User } from '../models';
import bcrypt from 'bcryptjs';
// const generateAuthToken = async (user: Document & UserModelProps) => {
//     // Generate an auth token for the user
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY) as string;
//     const tokens = user.tokens.concat(token);
//     user.tokens = tokens;
//     await user.save();
//     return token;
// };

/**
 * Validate the POST req body and create a new User
 */

const PUBLIC_FIELDS = 'firstname lastname email';
const create = async (req, res, next) => {
    const user = new User(req.body);
    const errors = user.validateSync();

    if (errors) {
        return res.status(401).send(errors);
    }

    const duplicate = await User.findOne({ email: req.body.email });

    if (duplicate) {
        return res.status(400).send('User exists');
    }

    try {
        user.password = await bcrypt.hash(req.body.password, 8);
        await user.save();
        res.status(201).send('created user');
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Get a single user
 * @param {String} name - the name of the User to retrieve
 */
const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id, PUBLIC_FIELDS);
        return res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
const getAll = async (req, res) => {
    // const skip = parseSkipLimit(req.query.skip) || 0;
    // const limit = parseSkipLimit(req.query.limit, 1000) || 1000;
    // if (skip instanceof APIError) {
    //     return next(skip);
    // } else if (limit instanceof APIError) {
    //     return next(limit);
    // }

    const skip = req.query.skip;
    const limit = req.query.limit;
    try {
        const users = await User.find({}, 'firstname lastname email', { skip, limit });
        return res.status(200).send(users);
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Update a single user
 * @param {String} name - the name of the User to update
 */
const update = async (req, res) => {
    const { id, ...props } = req.body;
    try {
        const user = await User.updateOne(id, props, { runValidators: true });
        return res.send('user updated');
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Remove a single user
 * @param {String} name - the name of the User to remove
 */
const remove = async (req, res) => {
    const { id } = req.params;
    try {
        const deleteMsg = await User.deleteOne(id);
        return res.send(deleteMsg);
    } catch (err) {
        res.status(400).send(err);
    }
};

export { create, update, remove, getById, getAll };
