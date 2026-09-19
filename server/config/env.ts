import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "..", ".env") });

function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(
      `Missing ${name} in server/.env — paste your MongoDB connection string as MONGODB_URI.`,
    );
  }
  return value;
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  MONGODB_URI: required("MONGODB_URI"),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173,http://localhost:8080,http://localhost:8081",
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET?.trim() || "dev-admin-secret-change-me",
  AUTH_COOKIE: process.env.AUTH_COOKIE?.trim() || "gsc_admin",
  ADMIN_EMAIL: (process.env.ADMIN_EMAIL?.trim() || "admin@gmail.com").toLowerCase(),
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "123456",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim() || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim() || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim() || "",
  SMTP_HOST: process.env.SMTP_HOST?.trim() || (process.env.SMTP_USER?.trim() ? "smtp.gmail.com" : ""),
  SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER?.trim() || "",
  SMTP_PASS: process.env.SMTP_PASS?.trim() || "",
  SMTP_FROM: process.env.SMTP_FROM?.trim() || "",
  WEB3FORMS_KEY: process.env.WEB3FORMS_KEY?.trim() || "",
};
