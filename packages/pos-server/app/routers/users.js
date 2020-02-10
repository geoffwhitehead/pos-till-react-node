// npm packages
const express = require("express");

// app imports
const { userHandler, usersHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readUsers } = usersHandler;
const { createUser, readUser, updateUser, deleteUser } = usersHandler;

/* All the Users Route */
router
  .route("")
  .get(readUser)
  .post(createUser);

/* Single User by Name Route */
router
  .route("/:name")
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
