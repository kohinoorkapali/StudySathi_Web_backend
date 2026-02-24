import { jest } from "@jest/globals";
import supertest from "supertest";

// MOCK MODELS
await jest.unstable_mockModule("../Model/studyMaterialModel.js", () => ({
  StudyMaterial: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

await jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: {},
}));


await jest.unstable_mockModule("fs", () => ({
  default: {
    existsSync: jest.fn(),
    unlinkSync: jest.fn(),
  },
}));

await jest.unstable_mockModule("path", () => ({
  default: {
    resolve: jest.fn((...args) => args.join("/")),
  },
}));
// IMPORT AFTER MOCKS

const { StudyMaterial } = await import("../Model/studyMaterialModel.js");
const fs = (await import("fs")).default;

const express = (await import("express")).default;
const materialRouter =
  (await import("../Routes/studyMaterialRoutes.js")).default;

// Express App

const app = express();
app.use(express.json());
app.use("/api/materials", materialRouter);

// TEST SUITE 

describe("Material Routes (Integration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // GET ALL MATERIALS
  it("should get all materials", async () => {
    StudyMaterial.findAll.mockResolvedValue([
      {
        id: 1,
        title: "Test",
        file_path: "file.pdf",
        file_type: "pdf",
        User: { username: "author" },
        createdAt: "date",
      },
    ]);

    const res = await supertest(app).get("/api/materials");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  // GET MY MATERIALS
  it("should get my materials", async () => {
    StudyMaterial.findAll.mockResolvedValue([
      { id: 1, title: "Mine" },
    ]);

    const res = await supertest(app).get("/api/materials/my");

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  // DOWNLOAD MATERIAL - NOT FOUND
  it("should return 404 if material not found", async () => {
    StudyMaterial.findByPk.mockResolvedValue(null);

    const res = await supertest(app).get("/api/materials/download/1");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Material not found");
  });

  // DELETE MATERIAL
  it("should delete material", async () => {
    const mockMaterial = {
      file_path: "file.pdf",
      destroy: jest.fn(),
    };

    StudyMaterial.findByPk.mockResolvedValue(mockMaterial);
    fs.existsSync.mockReturnValue(true);

    const res = await supertest(app).delete("/api/materials/1");

    expect(mockMaterial.destroy).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Material deleted successfully");
  });

  // UPDATE MATERIAL
  it("should update material", async () => {
    const mockMaterial = {
      id: 1,
      title: "Old",
      description: "Old desc",
      save: jest.fn(),
    };

    StudyMaterial.findByPk.mockResolvedValue(mockMaterial);

    const res = await supertest(app)
      .put("/api/materials/1")
      .send({ title: "New Title" });

    expect(mockMaterial.save).toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Material updated successfully");
  });

  // UPLOAD MATERIAL
  it("should upload material", async () => {
    StudyMaterial.create.mockResolvedValue({
      id: 1,
      title: "Uploaded",
      file_path: "123-file.pdf",
    });

    const res = await supertest(app)
      .post("/api/materials")
      .field("title", "Uploaded")
      .attach("file", Buffer.from("dummy content"), "file.pdf");

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("Study material uploaded successfully");
  });
});