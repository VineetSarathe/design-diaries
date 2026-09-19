import fs from "node:fs/promises";
import path from "node:path";
import { Testimonial } from "../models/testimonial.model";
import { getCloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { uploadTestimonialImageFromPath } from "../utils/cloudinary-images";

const ORIGINAL_IMAGES = [
  { company: "Iron Standard, Indore", file: "project-1.jpg", slug: "iron-standard" },
  { company: "Forge 24, Bhopal", file: "project-3.jpg", slug: "forge-24" },
  { company: "Sanctum Wellness, Pune", file: "project-2.jpg", slug: "sanctum-wellness" },
  { company: "Athlete Lab, Bengaluru", file: "project-4.jpg", slug: "athlete-lab" },
] as const;

function assetsDir() {
  return path.resolve(__dirname, "../../gym-space-craft-main/src/assets");
}

function publicDir() {
  return path.resolve(__dirname, "../../gym-space-craft-main/public/testimonials");
}

async function copyLocalFallback(file: string, slug: string) {
  const from = path.join(assetsDir(), file);
  const destDir = publicDir();
  await fs.mkdir(destDir, { recursive: true });
  const dest = path.join(destDir, `${slug}.jpg`);
  await fs.copyFile(from, dest);
  return `/testimonials/${slug}.jpg`;
}

export async function attachOriginalTestimonialImages(): Promise<void> {
  const missing = await Testimonial.find({
    $or: [{ imageUrl: "" }, { imageUrl: { $exists: false } }],
  });
  if (missing.length === 0) return;

  const useCloudinary = isCloudinaryConfigured();
  let uploaded = 0;

  for (const item of ORIGINAL_IMAGES) {
    const doc = missing.find((row) => row.company === item.company);
    if (!doc) continue;

    const filePath = path.join(assetsDir(), item.file);
    try {
      await fs.access(filePath);
    } catch {
      continue;
    }

    try {
      if (useCloudinary) {
        const result = await uploadTestimonialImageFromPath(filePath, item.slug);
        doc.imageUrl = result.imageUrl;
        doc.imagePublicId = result.imagePublicId;
      } else {
        doc.imageUrl = await copyLocalFallback(item.file, item.slug);
        doc.imagePublicId = "";
      }
      await doc.save();
      uploaded += 1;
    } catch {
      doc.imageUrl = await copyLocalFallback(item.file, item.slug);
      doc.imagePublicId = "";
      await doc.save();
      uploaded += 1;
    }
  }

  if (uploaded) {
    console.log(`Testimonial photos attached: ${uploaded}`);
  }
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function publicFileFromUrl(imageUrl: string) {
  if (!imageUrl.startsWith("/")) return "";
  return path.resolve(__dirname, "../../gym-space-craft-main/public", imageUrl.replace(/^\//, ""));
}

async function resolveTestimonialSource(imageUrl: string, company: string) {
  if (!imageUrl || imageUrl.startsWith("https://res.cloudinary.com/")) return { filePath: "", slug: "" };

  const publicPath = publicFileFromUrl(imageUrl);
  const original = ORIGINAL_IMAGES.find(
    (item) => item.company === company || imageUrl.includes(`/${item.slug}.`),
  );

  if (publicPath && (await fileExists(publicPath))) {
    return { filePath: publicPath, slug: original?.slug || path.parse(publicPath).name };
  }
  if (!original) return { filePath: "", slug: "" };

  const assetPath = path.join(assetsDir(), original.file);
  if (await fileExists(assetPath)) return { filePath: assetPath, slug: original.slug };
  return { filePath: "", slug: "" };
}

export async function migrateTestimonialImagesToCloudinary(): Promise<void> {
  try {
    await getCloudinary().api.ping();
  } catch (err) {
    console.error("Cloudinary ping failed. Testimonial images were not moved.", err);
    return;
  }

  const docs = await Testimonial.find();
  let moved = 0;

  for (const doc of docs) {
    const source = await resolveTestimonialSource(doc.imageUrl, doc.company);
    if (!source.filePath) continue;
    const uploaded = await uploadTestimonialImageFromPath(source.filePath, source.slug || doc.name);
    await Testimonial.updateOne(
      { _id: doc._id },
      { $set: { imageUrl: uploaded.imageUrl, imagePublicId: uploaded.imagePublicId } },
    );
    moved += 1;
  }

  if (moved > 0) console.log(`Moved ${moved} testimonial photo(s) to Cloudinary`);
}
