import { User } from "../models";
import { APIError, parseSkipLimit } from "../helpers";

/**
 * Validate the POST request body and create a new User
 */
const createUser = async (request, response, next) => {
  console.log("!!! CREATE ", request.body);

  const user = new User(request.body);

  const errors = user.validateSync();

  if (errors) {
    console.log("INVALID");
    return next(new APIError(400, "Bad Request", errors));
  }

  try {
    await user.save();
    return response.status(201).json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * Get a single user
 * @param {String} name - the name of the User to retrieve
 */
const readUser = async (request, response, next) => {
  const { name } = request.params;
  try {
    const user = await User.findOne(name);
    return response.json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * List all the users. Query params ?skip=0&limit=1000 by default
 */
async function readUsers(request, response, next) {
  /* pagination validation */

  console.log("!!!!!!!!!!!!!!!! HERE");
  console.log("!!!!!!!!!!!!!!!! HERE");
  console.log("!!!!!!!!!!!!!!!! HERE");
  console.log("!!!!!!!!!!!!!!!! HERE");
  let skip = parseSkipLimit(request.query.skip) || 0;
  let limit = parseSkipLimit(request.query.limit, 1000) || 1000;
  if (skip instanceof APIError) {
    return next(skip);
  } else if (limit instanceof APIError) {
    return next(limit);
  }

  try {
    const users = await User.find({}, {}, skip, limit);
    console.log("USER ", users);
    return response(users);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single user
 * @param {String} name - the name of the User to update
 */
const updateUser = async (request, response, next) => {
  const { id, ...props } = request.body;
  try {
    const user = await User.updateOne(id, props, { runValidators: true });
    return response.json(user);
  } catch (err) {
    return next(err);
  }
};

/**
 * Remove a single user
 * @param {String} name - the name of the User to remove
 */
const deleteUser = async (request, response, next) => {
  const { id } = request.params;
  try {
    const deleteMsg = await User.deleteOne(id);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
};

export { createUser, readUser, readUsers, updateUser, deleteUser };
