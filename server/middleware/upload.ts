import multer from "multer";
import { AppError } from "../utils/appError";

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|bmp|tiff?|heic|heif|svg)$/i;

function isImageFile(file: Express.Multer.File) {
  const mime = (file.mimetype || "").toLowerCase();
  const name = file.originalname.toLowerCase();
  if (mime.startsWith("image/")) return true;
  return IMAGE_EXT.test(name);
}

function isVideoFile(file: Express.Multer.File) {
  const mime = (file.mimetype || "").toLowerCase();
  const name = file.originalname.toLowerCase();
  return mime.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(name);
}

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!isImageFile(file)) {
      cb(new AppError(400, "Please upload an image"));
      return;
    }
    cb(null, true);
  },
}).single("image");

function projectFileAllowed(file: Express.Multer.File) {
  if (file.fieldname === "card") return isImageFile(file);
  return isImageFile(file) || isVideoFile(file);
}

export const projectImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!projectFileAllowed(file)) {
      cb(new AppError(400, "Please upload an image, or an MP4 / WEBM / MOV video"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "card", maxCount: 1 },
  { name: "images", maxCount: 40 },
]);

export const testimonialImageUpload = imageUpload;

function leadFileAllowed(file: Express.Multer.File) {
  const mime = (file.mimetype || "").toLowerCase();
  const name = file.originalname.toLowerCase();
  if (isImageFile(file)) return true;
  if (mime === "application/pdf" || name.endsWith(".pdf")) return true;
  if (name.endsWith(".dwg") || mime.includes("dwg") || mime.includes("acad")) return true;
  return false;
}

function recognitionFileAllowed(file: Express.Multer.File) {
  if (file.fieldname === "image") return isImageFile(file);
  return isImageFile(file) || isVideoFile(file);
}

export const recognitionImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!recognitionFileAllowed(file)) {
      cb(new AppError(400, "Please upload an image, or an MP4 / WEBM / MOV video"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "images", maxCount: 16 },
]);

export const blogImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!isImageFile(file)) {
      cb(new AppError(400, "Please upload an image"));
      return;
    }
    cb(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "pointImages", maxCount: 24 },
]);

export const leadFileUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 40 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!leadFileAllowed(file)) {
      cb(new AppError(400, "Please attach an image, PDF or DWG file"));
      return;
    }
    cb(null, true);
  },
}).single("file");
