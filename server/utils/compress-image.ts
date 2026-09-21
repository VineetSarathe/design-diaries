import sharp from "sharp";
import { AppError } from "./appError";

const FOLDER_MAX_EDGE: Record<string, number> = {
  "client-logos": 2400,
  instagram: 2400,
  testimonials: 4500,
  blogs: 4500,
  recognition: 4500,
  projects: 4500,
  "lead-files": 4500,
};

export function maxEdgeForFolder(folder: string) {
  return FOLDER_MAX_EDGE[folder] ?? 4500;
}

/** Only used as a last-resort fallback when Cloudinary is down. Keep near-original quality. */
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
      .webp({ quality: 95, effort: 4 })
      .toBuffer();
  } catch {
    throw new AppError(400, "Could not read that image. Please upload a valid image file.");
  }
}
