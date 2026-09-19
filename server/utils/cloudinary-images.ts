import { AppError } from "./appError";
import { getCloudinary, isCloudinaryConfigured } from "../config/cloudinary";

export function slugifyName(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return slug || "client";
}

type UploadImageOptions = {
  format?: string;
  maxEdge?: number;
};

function uploadOptions(folder: string, publicId: string, opts?: UploadImageOptions) {
  const maxEdge = opts?.maxEdge;
  return {
    folder,
    public_id: publicId,
    resource_type: "image" as const,
    overwrite: false,
    ...(opts?.format ? { format: opts.format } : {}),
    ...(maxEdge
      ? {
          transformation: [
            { width: maxEdge, height: maxEdge, crop: "limit", quality: "auto:good" },
          ],
        }
      : {}),
  };
}

export async function uploadImageBuffer(
  buffer: Buffer,
  name: string,
  folder: string,
  opts?: UploadImageOptions,
) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "Image storage is not configured");
  }

  const publicId = `${slugifyName(name)}-${Date.now()}`;

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = getCloudinary().uploader.upload_stream(
        uploadOptions(folder, publicId, opts),
        (error, uploaded) => {
          if (error || !uploaded?.secure_url || !uploaded.public_id) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        },
      );
      stream.end(buffer);
    });
    return { imageUrl: result.secure_url, imagePublicId: result.public_id };
  } catch {
    throw new AppError(502, "Could not upload the image. Please try again.");
  }
}

export async function uploadImageFromPath(
  filePath: string,
  name: string,
  folder: string,
  opts?: UploadImageOptions,
) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "Image storage is not configured");
  }

  const publicId = `${slugifyName(name)}-${Date.now()}`;

  try {
    const uploaded = await getCloudinary().uploader.upload(
      filePath,
      uploadOptions(folder, publicId, opts),
    );
    if (!uploaded.secure_url || !uploaded.public_id) {
      throw new Error("Upload failed");
    }
    return { imageUrl: uploaded.secure_url, imagePublicId: uploaded.public_id };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "Could not upload the image. Please try again.");
  }
}

export function uploadTestimonialImage(buffer: Buffer, name: string) {
  return uploadImageBuffer(buffer, name, "testimonials");
}

export function uploadTestimonialImageFromPath(filePath: string, name: string) {
  return uploadImageFromPath(filePath, name, "testimonials");
}

const CLIENT_LOGO_UPLOAD = { format: "webp", maxEdge: 800 };

export function uploadClientLogoImage(buffer: Buffer, name: string) {
  return uploadImageBuffer(buffer, name, "client-logos", CLIENT_LOGO_UPLOAD);
}

export function uploadClientLogoFromPath(filePath: string, name: string) {
  return uploadImageFromPath(filePath, name, "client-logos", CLIENT_LOGO_UPLOAD);
}

export function uploadProjectImage(buffer: Buffer, name: string) {
  return uploadImageBuffer(buffer, name, "projects");
}

export async function uploadRawBuffer(buffer: Buffer, name: string, folder: string) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "File storage is not configured");
  }

  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : undefined;
  const publicId = `${slugifyName(name)}-${Date.now()}`;

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = getCloudinary().uploader.upload_stream(
        {
          folder,
          public_id: publicId,
          resource_type: "raw",
          overwrite: false,
          ...(ext ? { format: ext } : {}),
        },
        (error, uploaded) => {
          if (error || !uploaded?.secure_url || !uploaded.public_id) {
            reject(error || new Error("Upload failed"));
            return;
          }
          resolve({ secure_url: uploaded.secure_url, public_id: uploaded.public_id });
        },
      );
      stream.end(buffer);
    });
    return { fileUrl: result.secure_url, filePublicId: result.public_id };
  } catch {
    throw new AppError(502, "Could not upload the file. Please try again.");
  }
}

const VIDEO_EAGER = [
  {
    width: 1280,
    crop: "limit",
    quality: "auto:good",
    fetch_format: "mp4",
    audio_codec: "aac",
    video_codec: "h264",
    bit_rate: "1000k",
  },
];

function videoUploadOptions(folder: string, publicId: string, alreadyCompressed = false) {
  return {
    folder,
    public_id: publicId,
    resource_type: "video" as const,
    overwrite: false,
    format: "mp4",
    ...(alreadyCompressed
      ? {}
      : {
          eager: VIDEO_EAGER,
          eager_async: false,
        }),
  };
}

function compressedVideoUrl(uploaded: {
  secure_url?: string;
  eager?: Array<{ secure_url?: string }>;
}) {
  const eagerUrl = uploaded.eager?.[0]?.secure_url;
  if (eagerUrl) return eagerUrl;
  const original = uploaded.secure_url || "";
  if (!original.includes("/video/upload/") || original.includes("br_1000k")) return original;
  return original
    .replace("/video/upload/", "/video/upload/ac_aac,br_1000k,c_limit,f_mp4,q_auto:good,vc_h264,w_1280/")
    .replace(/\.mov(\?|$)/i, ".mp4$1");
}

export async function compressCloudinaryVideo(publicId: string) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "File storage is not configured");
  }
  const result = await getCloudinary().uploader.explicit(publicId, {
    resource_type: "video",
    type: "upload",
    eager: VIDEO_EAGER,
    eager_async: false,
  });
  const imageUrl = compressedVideoUrl(result);
  if (!imageUrl) throw new Error("Video compress failed");
  return { imageUrl, imagePublicId: result.public_id || publicId };
}

export async function uploadVideoBuffer(
  buffer: Buffer,
  name: string,
  folder: string,
  alreadyCompressed = false,
) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "File storage is not configured");
  }

  const publicId = `${slugifyName(name)}-${Date.now()}`;

  try {
    const result = await new Promise<{ secure_url: string; public_id: string; eager?: Array<{ secure_url?: string }> }>(
      (resolve, reject) => {
        const stream = getCloudinary().uploader.upload_stream(
          videoUploadOptions(folder, publicId, alreadyCompressed),
          (error, uploaded) => {
            if (error || !uploaded?.secure_url || !uploaded.public_id) {
              reject(error || new Error("Upload failed"));
              return;
            }
            resolve({
              secure_url: uploaded.secure_url,
              public_id: uploaded.public_id,
              eager: uploaded.eager as Array<{ secure_url?: string }> | undefined,
            });
          },
        );
        stream.end(buffer);
      },
    );
    return { imageUrl: compressedVideoUrl(result), imagePublicId: result.public_id };
  } catch {
    throw new AppError(502, "Could not upload the video. Please try again.");
  }
}

export async function uploadVideoFromPath(filePath: string, name: string, folder: string, alreadyCompressed = false) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(500, "File storage is not configured");
  }

  const publicId = `${slugifyName(name)}-${Date.now()}`;

  try {
    const uploaded = await getCloudinary().uploader.upload(filePath, videoUploadOptions(folder, publicId, alreadyCompressed));
    const imageUrl = compressedVideoUrl(uploaded);
    if (!imageUrl || !uploaded.public_id) {
      throw new Error("Upload failed");
    }
    return { imageUrl, imagePublicId: uploaded.public_id };
  } catch (err) {
    if (err instanceof AppError) throw err;
    throw new AppError(502, "Could not upload the video. Please try again.");
  }
}

export async function deleteCloudinaryImage(
  publicId: string,
  resourceType: "image" | "video" = "image",
): Promise<{ ok: true } | { ok: false }> {
  if (!publicId) return { ok: true };
  if (!isCloudinaryConfigured()) return { ok: false };

  try {
    const result = await getCloudinary().uploader.destroy(publicId, { resource_type: resourceType });
    if (result.result === "ok" || result.result === "not found") return { ok: true };
    if (resourceType === "image") {
      const video = await getCloudinary().uploader.destroy(publicId, { resource_type: "video" });
      if (video.result === "ok" || video.result === "not found") return { ok: true };
    }
    return { ok: false };
  } catch {
    return { ok: false };
  }
}
