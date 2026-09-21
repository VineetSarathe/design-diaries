import { isCloudinaryConfigured } from "../config/cloudinary";
import { uploadImageBuffer } from "./cloudinary-images";
import { compressImageToWebp, maxEdgeForFolder } from "./compress-image";
import { compressVideoToMp4 } from "./compress-video";
import { deleteLocalPublicFile, savePublicFile, savePublicImage } from "./local-images";

export async function storeImageBuffer(buffer: Buffer, name: string, folder: string, mimetype?: string) {
  if (isCloudinaryConfigured()) {
    try {
      return await uploadImageBuffer(buffer, name, folder);
    } catch {
      // Cloudinary cloud_name mismatch etc. fall back to local files.
    }
  }
  const webp = await compressImageToWebp(buffer, maxEdgeForFolder(folder));
  return savePublicImage(folder, name, webp, "image/webp");
}

export async function storeImageFromPath(filePath: string, name: string, folder: string, _localFilename?: string) {
  const buffer = await import("node:fs/promises").then((fs) => fs.readFile(filePath));
  return storeImageBuffer(buffer, name, folder);
}

function isVideoName(name: string, mimetype = "") {
  return mimetype.startsWith("video/") || /\.(mp4|webm|mov)$/i.test(name);
}

async function storeVideoBuffer(buffer: Buffer, name: string, folder: string) {
  let payload = buffer;
  let alreadyCompressed = false;
  try {
    payload = await compressVideoToMp4(buffer, name);
    alreadyCompressed = true;
  } catch {
    // Keep the original file and let Cloudinary compress if needed.
  }

  if (isCloudinaryConfigured()) {
    try {
      const { uploadVideoBuffer } = await import("./cloudinary-images");
      const uploaded = await uploadVideoBuffer(payload, name, folder, alreadyCompressed);
      return { ...uploaded, kind: "video" as const };
    } catch {
      // fall through to local mp4
    }
  }

  const saved = await savePublicFile(folder, `${name}.mp4`, payload, "video/mp4");
  return { imageUrl: saved.fileUrl, imagePublicId: saved.filePublicId, kind: "video" as const };
}

export async function storeMediaFromPath(filePath: string, name: string, folder: string) {
  if (isVideoName(filePath) || isVideoName(name)) {
    const buffer = await import("node:fs/promises").then((fs) => fs.readFile(filePath));
    return storeVideoBuffer(buffer, name, folder);
  }
  const uploaded = await storeImageFromPath(filePath, name, folder, name);
  return { ...uploaded, kind: "image" as const };
}

export async function storeMediaBuffer(buffer: Buffer, name: string, folder: string, mimetype: string) {
  if (isVideoName(name, mimetype)) {
    return storeVideoBuffer(buffer, name, folder);
  }
  const uploaded = await storeImageBuffer(buffer, name, folder, mimetype);
  return { ...uploaded, kind: "image" as const };
}

export async function removeStoredImage(
  imageUrl: string,
  imagePublicId: string,
  folder: string,
  kind: "image" | "video" = "image",
) {
  if (imagePublicId) {
    const { deleteCloudinaryImage } = await import("./cloudinary-images");
    return deleteCloudinaryImage(imagePublicId, kind === "video" || /\.mp4(\?|$)/i.test(imageUrl) || imageUrl.includes("/video/upload/") ? "video" : "image");
  }
  await deleteLocalPublicFile(imageUrl, folder);
  return { ok: true as const };
}
