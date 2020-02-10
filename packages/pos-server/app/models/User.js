// npm packages
const mongoose = require("mongoose");

// app imports
const { APIError } = require("../helpers");

// globals
const Schema = mongoose.Schema;

const thingSchema = new Schema({
  name: String,
  number: Number,
  stuff: [String],
  url: String
});

thingSchema.statics = {
  /**
   * Create a Single New User
   * @param {object} newThing - an instance of User
   * @returns {Promise<User, APIError>}
   */
  async createThing(newThing) {
    const duplicate = await this.findOne({ name: newThing.name });
    if (duplicate) {
      throw new APIError(
        409,
        "User Already Exists",
        `There is already a user with name '${newThing.name}'.`
      );
    }
    const user = await newThing.save();
    return user.toObject();
  },
  /**
   * Delete a single User
   * @param {String} name - the User's name
   * @returns {Promise<User, APIError>}
   */
  async deleteThing(name) {
    const deleted = await this.findOneAndRemove({ name });
    if (!deleted) {
      throw new APIError(404, "User Not Found", `No user '${name}' found.`);
    }
    return deleted.toObject();
  },
  /**
   * Get a single User by name
   * @param {String} name - the User's name
   * @returns {Promise<User, APIError>}
   */
  async readThing(name) {
    const user = await this.findOne({ name });

    if (!user) {
      throw new APIError(404, "User Not Found", `No user '${name}' found.`);
    }
    return user.toObject();
  },
  /**
   * Get a list of Users
   * @param {Object} query - pre-formatted query to retrieve users.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Users, APIError>}
   */
  async readThings(query, fields, skip, limit) {
    const users = await this.find(query, fields)
      .skip(skip)
      .limit(limit)
      .sort({ name: 1 })
      .exec();
    if (!users.length) {
      return [];
    }
    return users.map(user => user.toObject());
  },
  /**
   * Patch/Update a single User
   * @param {String} name - the User's name
   * @param {Object} thingUpdate - the json containing the User attributes
   * @returns {Promise<User, APIError>}
   */
  async updateThing(name, thingUpdate) {
    const user = await this.findOneAndUpdate({ name }, thingUpdate, {
      new: true
    });
    if (!user) {
      throw new APIError(404, "User Not Found", `No user '${name}' found.`);
    }
    return user.toObject();
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!thingSchema.options.toObject) thingSchema.options.toObject = {};
thingSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
thingSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model("User", thingSchema);
