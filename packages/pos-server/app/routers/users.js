// npm packages
const express = require("express");

// app imports
const { userHandler, usersHandler } = require("../handlers");

// globals
const router = new express.Router();
const { readUsers } = usersHandler;
const { createUser, readUser, updateUser, deleteUser } = userHandler;

/* All the Users Route */
router
  .route("")
  .get(readUsers)
  .post(createUser);

/* Single User by Name Route */
router
  .route("/:name")
  .get(readUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
