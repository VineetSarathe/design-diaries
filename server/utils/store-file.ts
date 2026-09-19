import { isCloudinaryConfigured } from "../config/cloudinary";
import { uploadRawBuffer } from "./cloudinary-images";
import { savePublicFile } from "./local-images";
import { storeImageBuffer } from "./store-image";

export async function storeFileBuffer(buffer: Buffer, name: string, folder: string, mimetype: string) {
  if (mimetype.startsWith("image/")) {
    const stored = await storeImageBuffer(buffer, name, folder, mimetype);
    return { fileUrl: stored.imageUrl, filePublicId: stored.imagePublicId };
  }

  if (isCloudinaryConfigured()) {
    try {
      return await uploadRawBuffer(buffer, name, folder);
    } catch {
      // Cloudinary raw upload failed; keep the file locally so the lead still has it.
    }
  }

  return savePublicFile(folder, name, buffer, mimetype);
}
