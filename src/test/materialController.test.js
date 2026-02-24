// src/test/materialController.test.js
import { jest } from "@jest/globals";

await jest.unstable_mockModule("../Model/studyMaterialModel.js", () => ({
  StudyMaterial: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

await jest.unstable_mockModule("../Model/userModel.js", () => ({
  User: {},
}));

await jest.unstable_mockModule("fs", () => ({
  existsSync: jest.fn(),
  unlinkSync: jest.fn(),
}));

await jest.unstable_mockModule("path", () => ({
  resolve: jest.fn((...args) => args.join("/")),
}));

const { StudyMaterial } = await import("../Model/studyMaterialModel.js");
const { User } = await import("../Model/userModel.js");
const fs = await import("fs");
const path = await import("path");

const materialController = await import("../Controller/studyMaterialController.js");

describe("Material Controller (minimal)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 404 if material not found on download", async () => {
    StudyMaterial.findByPk.mockResolvedValue(null);
    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await materialController.downloadMaterial(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: "Material not found" });
  });

  it("should delete a material successfully", async () => {
    const mockMaterial = { file_path: "file.pdf", destroy: jest.fn() };
    StudyMaterial.findByPk.mockResolvedValue(mockMaterial);
    fs.existsSync.mockReturnValue(true);

    const req = { params: { id: 1 } };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await materialController.deleteMaterial(req, res);

    expect(fs.unlinkSync).toHaveBeenCalledWith("./uploads/materials/file.pdf");
    expect(mockMaterial.destroy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ message: "Material deleted successfully" });
  });

  it("should get all materials", async () => {
    StudyMaterial.findAll.mockResolvedValue([
      { id: 1, title: "Test", file_path: "file.pdf", file_type: "pdf", User: { username: "author" }, createdAt: "date" },
    ]);

    const req = {};
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    await materialController.getAllMaterials(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      data: [
        { id: 1, title: "Test", description: undefined, stream: undefined, createdAt: "date", author: "author", file_path: "file.pdf", file_type: "pdf" },
      ],
    });
  });
});