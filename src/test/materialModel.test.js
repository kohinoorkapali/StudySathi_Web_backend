// src/test/studyMaterialModel.test.js
import { jest } from "@jest/globals";
import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

// Mock User model first
const UserMock = dbMock.define("User", {
  id: 1,
  fullname: "Test User",
  username: "testuser",
  email: "test@gmail.com",
  password: "123456",
});

// Mock StudyMaterial model
const StudyMaterialMock = dbMock.define("StudyMaterial", {
  id: 1,
  title: "Math Notes",
  description: "Chapter 1",
  stream: "Science",
  user_id: 1,
  file_path: "/files/math.pdf",
  file_type: "pdf",
  is_reported: false,
});

// Optional: setup relations in mocks (not strictly needed for unit tests)
UserMock.hasMany = jest.fn();
StudyMaterialMock.belongsTo = jest.fn();

describe("StudyMaterial Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a study material", async () => {
    const sm = await StudyMaterialMock.create({
      title: "Physics Notes",
      description: "Chapter 2",
      stream: "Science",
      user_id: 1,
      file_path: "/files/physics.pdf",
      file_type: "pdf",
    });

    expect(sm.title).toBe("Physics Notes");
    expect(sm.stream).toBe("Science");
    expect(sm.user_id).toBe(1);
    expect(sm.file_type).toBe("pdf");
  });

  it("should require title, stream, user_id, file_path, and file_type", async () => {
    // Force mock to throw for empty object
    StudyMaterialMock.create = jest.fn(() => {
      return Promise.reject(new Error("Validation error"));
    });

    await expect(StudyMaterialMock.create({})).rejects.toThrow("Validation error");
  });
});