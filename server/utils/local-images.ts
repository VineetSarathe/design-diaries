import fs from "node:fs/promises";
import path from "node:path";
import { slugifyName } from "./cloudinary-images";

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function publicFolder(folder: string) {
  return path.resolve(__dirname, `../../gym-space-craft-main/public/${folder}`);
}

export async function savePublicImage(folder: string, name: string, buffer: Buffer, mimetype: string) {
  const ext = mimetype === "image/webp" ? "webp" : EXT[mimetype] || "webp";
  const destDir = publicFolder(folder);
  await fs.mkdir(destDir, { recursive: true });
  const filename = `${slugifyName(name)}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(destDir, filename), buffer);
  return { imageUrl: `/${folder}/${filename}`, imagePublicId: "" };
}

export async function savePublicFile(folder: string, originalName: string, buffer: Buffer, mimetype: string) {
  const fromName = path.extname(originalName).replace(".", "").toLowerCase();
  const ext = fromName || EXT[mimetype] || "bin";
  const destDir = publicFolder(folder);
  await fs.mkdir(destDir, { recursive: true });
  const filename = `${slugifyName(originalName)}-${Date.now()}.${ext}`;
  await fs.writeFile(path.join(destDir, filename), buffer);
  return { fileUrl: `/${folder}/${filename}`, filePublicId: "" };
}

export async function copyPublicAsset(folder: string, fromPath: string, filename: string) {
  const destDir = publicFolder(folder);
  await fs.mkdir(destDir, { recursive: true });
  await fs.copyFile(fromPath, path.join(destDir, filename));
  return `/${folder}/${filename}`;
}

export async function deleteLocalPublicFile(imageUrl: string, folder: string) {
  const prefix = `/${folder}/`;
  if (!imageUrl.startsWith(prefix)) return;
  const filename = path.basename(imageUrl);
  if (!filename || filename === "." || filename === "..") return;
  await fs.unlink(path.join(publicFolder(folder), filename)).catch(() => undefined);
}
