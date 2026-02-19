import express from "express";
import multer from "multer";
import { uploadMaterial, getAllMaterials, getMyMaterials, downloadMaterial } from "../Controller/studyMaterialController.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/materials/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});


const upload = multer({ storage });

// Routes
router.post("/", upload.single("file"), uploadMaterial); // removed /upload
router.get("/", getAllMaterials);
router.get("/my", getMyMaterials);
router.get("/download/:id", downloadMaterial);


export default router;
