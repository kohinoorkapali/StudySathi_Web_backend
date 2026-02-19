// src/controllers/materialController.js
import fs from "fs";
import path from "path";

import { StudyMaterial } from "../Model/studyMaterialModel.js";
import { User } from "../Model/userModel.js";

export const downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the material in DB
    const material = await StudyMaterial.findByPk(id);
    if (!material) return res.status(404).send({ message: "Material not found" });

    // Correct path: uploads/materials/<filename>
    const filePath = path.resolve("./uploads/materials", material.file_path);
    console.log("Downloading file at:", filePath);

    if (!fs.existsSync(filePath)) {
      console.log("File not found on server!");
      return res.status(404).send({ message: "File not found on server" });
    }

    // Send file
    res.download(filePath, material.file_path);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send({ message: err.message });
  }
};

// Upload a new material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, stream, user_id } = req.body;

    if (!req.file) {
      return res.status(400).send({ message: "File is required" });
    }

    const material = await StudyMaterial.create({
      title,
      description,
      stream,
      user_id,
      file_path: req.file.filename,
      file_type: req.file.mimetype,
    });

    res.status(201).send({
      message: "Study material uploaded successfully",
      data: material,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

// Get all materials with author info
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.findAll({
      include: [
        {
          model: User,
          attributes: ["fullname", "username"], // author info
        },
      ],
    });

    const result = materials.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      stream: m.stream,
      createdAt: m.createdAt,
      author: m.User?.username || "Unknown",
      file_path: m.file_path,    // ✅ send file path
      file_type: m.file_type,    // ✅ send MIME type
    }));

    res.status(200).send({ data: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};


// Get only materials uploaded by the logged-in user
export const getMyMaterials = async (req, res) => {
  try {
    const { user_id } = req.query;

    const materials = await StudyMaterial.findAll({
      where: { user_id },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["fullname"],
        },
      ],
    });

    const result = materials.map((m) => ({
      id: m.id,
      title: m.title,
      description: m.description,
      stream: m.stream,
      createdAt: m.createdAt,
      author: m.User?.fullname || "You",
      file_path: m.file_path,    // ✅ send file path
      file_type: m.file_type,    // ✅ send MIME type
    }));

    res.status(200).send({ data: result });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};


export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the material
    const material = await StudyMaterial.findByPk(id);
    if (!material) return res.status(404).send({ message: "Material not found" });

    // Delete file from disk
    const filePath = path.resolve("./uploads/materials", material.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete DB record
    await material.destroy();

    res.status(200).send({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send({ message: err.message });
  }
};

export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stream } = req.body;

    const material = await StudyMaterial.findByPk(id);
    if (!material) return res.status(404).send({ message: "Material not found" });

    // Update fields
    material.title = title || material.title;
    material.description = description || material.description;
    material.stream = stream || material.stream;

    await material.save();

    res.status(200).send({ message: "Material updated successfully", data: material });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).send({ message: err.message });
  }
};
