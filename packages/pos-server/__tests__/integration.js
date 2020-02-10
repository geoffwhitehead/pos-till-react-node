/**
 * These tests currently only work if you have a local MongoDB database
 */
const app = require("../app/app");
const request = require("supertest");
const mongoose = require("mongoose");

let { User } = require("../app/models");
let exampleUser = {
  name: "Example",
  number: 5,
  stuff: ["cats", "dogs"],
  url: "https://google.com"
};

beforeEach(async () => {
  const testUser = new User(exampleUser);
  await testUser.save();
});

afterEach(async () => {
  await mongoose.connection.dropCollection("users");
});

afterAll(async () => {
  // CLEAN UP
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("GET /users", () => {
  test("Get a list of users", async () => {
    let response = await request(app).get("/users");
    expect(response.body).toEqual([exampleUser]);
  });
});

describe("POST /users", () => {
  test("Create a mini new User", async () => {
    let response = await request(app)
      .post("/users")
      .send({ name: "A User" });
    expect(response.body).toEqual({ name: "A User", stuff: [] });
  });
  test("Create a full new User", async () => {
    const fullUser = {
      name: "Other User",
      stuff: ["cats", "dogs"],
      number: 5,
      url: "http://google.com"
    };
    let response = await request(app)
      .post("/users")
      .send(fullUser);
    expect(response.body).toEqual(fullUser);
  });
  test("Cannot Create Users with the Same Name", async () => {
    let response = await request(app)
      .post("/users")
      .send({ name: "Example" });
    expect(response.status).toEqual(409);
  });
});

describe("PATCH /users/:name", () => {
  test("Update a user's name", async () => {
    let response = await request(app)
      .patch("/users/Example")
      .send({ name: "New Name" });
    expect(response.body).toEqual({ ...exampleUser, name: "New Name" });
  });
});

describe("DELETE /users/:name", () => {
  test("Delete a user name", async () => {
    let response = await request(app).delete("/users/Example");
    expect(response.body).toEqual(exampleUser);
  });
});
