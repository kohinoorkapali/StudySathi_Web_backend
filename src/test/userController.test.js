// src/test/userController.test.js
import { jest } from "@jest/globals"; // needed in ESM
import bcrypt from "bcryptjs";
import { User } from "../Model/userModel.js";
import * as userController from "../Controller/userController.js";

/* ===== Mock Response Helper ===== */
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller (minimal ESM)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===== GET ALL USERS =====
  it("should return all users", async () => {
    User.findAll = jest.fn().mockResolvedValue([{ id: 1, fullname: "Test" }]);
    const req = {};
    const res = mockResponse();

    await userController.getAll(req, res);

    expect(User.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      data: [{ id: 1, fullname: "Test" }],
      message: "Users retrieved successfully",
    });
  });

  // ===== REGISTER / SAVE USER =====
  it("should register user successfully", async () => {
    const req = {
      body: {
        fullname: "Test User",
        username: "testuser",
        email: "test@gmail.com",
        password: "password123",
      },
    };
    const res = mockResponse();

    // Mock checks for existing email/username
    User.findOne = jest
      .fn()
      .mockResolvedValueOnce(null) // email check
      .mockResolvedValueOnce(null); // username check

    // Mock bcrypt.hash
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    // Mock User.create
    User.create = jest.fn().mockResolvedValue({
      id: 1,
      fullname: "Test User",
      username: "testuser",
      email: "test@gmail.com",
      password: "hashedPassword",
    });

    await userController.save(req, res);

    expect(User.findOne).toHaveBeenCalledTimes(2);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("should return 409 if email already exists", async () => {
    const req = {
      body: { fullname: "Test", username: "test", email: "test@gmail.com", password: "123" },
    };
    const res = mockResponse();

    User.findOne = jest.fn().mockResolvedValue({ id: 1 }); // email exists

    await userController.save(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.send).toHaveBeenCalledWith({ message: "Email already registered" });
  });

  // ===== LOGIN =====
  it("should login successfully", async () => {
    const req = { body: { email: "test@gmail.com", password: "123" } };
    const res = mockResponse();

    User.findOne = jest.fn().mockResolvedValue({
      id: 1,
      fullname: "Test User",
      email: "test@gmail.com",
      password: "hashed",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    await userController.login(req, res);

    expect(bcrypt.compare).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      message: "Login successful",
      data: { id: 1, fullname: "Test User", email: "test@gmail.com" },
    });
  });

  it("should return 401 if login fails", async () => {
    const req = { body: { email: "test@gmail.com", password: "wrong" } };
    const res = mockResponse();

    User.findOne = jest.fn().mockResolvedValue({
      id: 1,
      password: "hashed",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    await userController.login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: "Invalid email or password" });
  });
});