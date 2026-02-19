import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/* -------------------- STUDY MATERIAL UPLOAD -------------------- */
const materialStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/materials/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Allowed study material extensions
const MATERIAL_EXTENSIONS = [".pdf", ".doc", ".docx", ".ppt", ".pptx"];

const materialFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (MATERIAL_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, Word, or PPT files are allowed for study material"), false);
  }
};

export const uploadMaterial = multer({
  storage: materialStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: materialFileFilter,
});
