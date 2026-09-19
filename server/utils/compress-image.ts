import sharp from "sharp";
import { AppError } from "./appError";

const FOLDER_MAX_EDGE: Record<string, number> = {
  "client-logos": 800,
  instagram: 1080,
  testimonials: 1600,
  blogs: 2000,
  recognition: 2000,
  projects: 2000,
  "lead-files": 2000,
};

export function maxEdgeForFolder(folder: string) {
  return FOLDER_MAX_EDGE[folder] ?? 2000;
}

export async function compressImageToWebp(source: string | Buffer, maxEdge: number) {
  try {
    return await sharp(source, { failOn: "none", limitInputPixels: false, animated: false })
      .rotate()
      .resize({
        width: maxEdge,
        height: maxEdge,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 78 })
      .toBuffer();
  } catch {
    throw new AppError(400, "Could not read that image. Please upload a valid image file.");
  }
}
