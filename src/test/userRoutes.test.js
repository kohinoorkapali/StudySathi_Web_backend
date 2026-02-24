// src/test/userRoutes.test.js
import { jest } from "@jest/globals";
await jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

import supertest from "supertest";

const { User } = await import("../Model/userModel.js");

const express = (await import("express")).default;
const userRouter = (await import("../Routes/userRoutes.js")).default;

const app = express();
app.use(express.json());
app.use("/api/users", userRouter);

describe("User Routes (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL USERS
  it("should get all users", async () => {
    User.findAll.mockResolvedValue([
      { id: 1, fullname: "Test User", email: "test@gmail.com" },
    ]);

    const res = await supertest(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      data: [{ id: 1, fullname: "Test User", email: "test@gmail.com" }],
      message: "Users retrieved successfully",
    });
  });

  // CREATE / SAVE USER
  it("should register a new user", async () => {
    User.findOne = jest.fn()
      .mockResolvedValueOnce(null) 
      .mockResolvedValueOnce(null); 

    User.create.mockResolvedValue({
      id: 1,
      fullname: "New User",
      username: "newuser",
      email: "new@gmail.com",
      password: "hashedpass",
    });

    const res = await supertest(app)
      .post("/api/users")
      .send({
        fullname: "New User",
        username: "newuser",
        email: "new@gmail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("id", 1);
    expect(res.body.message).toBe("User registered successfully");
  });

  // GET USER BY ID
  it("should get user by id", async () => {
    User.findOne.mockResolvedValue({
      id: 1,
      fullname: "Test User",
      email: "test@gmail.com",
    });

    const res = await supertest(app).get("/api/users/1");

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("id", 1);
    expect(res.body.message).toBe("User fetched successfully");
  });

  // UPDATE USER
  it("should update user by id", async () => {
    const mockUser = {
      id: 1,
      fullname: "Old Name",
      username: "olduser",
      email: "old@gmail.com",
      save: jest.fn(),
    };

    User.findOne.mockResolvedValue(mockUser);

    const res = await supertest(app)
      .patch("/api/users/1")
      .send({ fullname: "New Name" });

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.data.fullname).toBe("New Name");
    expect(res.body.message).toBe("User updated successfully");
  });

  // DELETE USER
  it("should delete user by id", async () => {
    const mockUser = { id: 1, destroy: jest.fn() };
    User.findOne.mockResolvedValue(mockUser);

    const res = await supertest(app).delete("/api/users/1");

    expect(mockUser.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("User deleted successfully");
  });
});