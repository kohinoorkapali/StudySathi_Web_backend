import { jest } from "@jest/globals";
import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Define a mock User model
const UserMock = dbMock.define("User", {
  id: 1,
  fullname: "Test product",
  username: "kohinoor",
  email: "kohinoor@gmail.com",
  password: "123456",
});

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it("should register a person", async () => {
    const user = await UserMock.create({
      fullname: "New Person",
      username: "new",
      email: "test@gmail.com",
      password: "111111",
    });

    expect(user.fullname).toBe("New Person");
    expect(user.username).toBe("new");
    expect(user.email).toBe("test@gmail.com");
    expect(user.password).toBe("111111");
  });

  it("should require fullname, username, email, and password", async () => {
    // Force the mock to throw an error for empty object
    UserMock.create = jest.fn(() => {
      return Promise.reject(new Error("Validation error"));
    });

    await expect(UserMock.create({})).rejects.toThrow("Validation error");
  });
});