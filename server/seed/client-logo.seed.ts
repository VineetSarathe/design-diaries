import fs from "node:fs/promises";
import path from "node:path";
import { ClientLogo } from "../models/client-logo.model";
import { getCloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { deleteCloudinaryImage, uploadClientLogoFromPath } from "../utils/cloudinary-images";

const ORIGINALS = [
  { name: "Ironworks", file: "logo-ironworks.png", slug: "ironworks" },
  { name: "Athlete Lab", file: "logo-athlete-lab.png", slug: "athlete-lab" },
  { name: "Pulse House", file: "logo-pulse-house.png", slug: "pulse-house" },
  { name: "Forge Club", file: "logo-forge-club.png", slug: "forge-club" },
  { name: "Core Nine", file: "logo-core-nine.png", slug: "core-nine" },
  { name: "Apex Fitness", file: "logo-apex-fitness.png", slug: "apex-fitness" },
] as const;

function assetsDir() {
  return path.resolve(__dirname, "../../gym-space-craft-main/src/assets");
}

export async function seedClientLogos(): Promise<void> {
  const originals = ORIGINALS.map((item) => item.name);
  const seeded = await ClientLogo.find({ name: { $in: originals } }).sort({ createdAt: 1 });
  const uniqueNames = new Set(seeded.map((doc) => doc.name));
  if (seeded.length === ORIGINALS.length * 2 && uniqueNames.size === ORIGINALS.length) {
    const keep = new Set<string>();
    for (const doc of seeded) {
      if (keep.has(doc.name)) await doc.deleteOne();
      else keep.add(doc.name);
    }
    const remaining = await ClientLogo.find().sort({ createdAt: 1 });
    await Promise.all(
      remaining.map((doc, index) => {
        doc.sortOrder = index + 1;
        return doc.save();
      }),
    );
  }

  const count = await ClientLogo.countDocuments();
  if (count > 0) return;
  console.log("Client logos collection is empty — add logos in Admin > Partners");
}

function logoDisplayName(fileName: string, index: number) {
  const raw = fileName.replace(/^\d+-/, "").replace(/\.[^.]+$/, "");
  if (/bharat/i.test(raw)) return "Bharat Fitness Den";
  if (raw.startsWith("file_")) return `Partner ${String(index + 1).padStart(2, "0")}`;
  return raw.replace(/_/g, " ").trim() || `Partner ${String(index + 1).padStart(2, "0")}`;
}

export async function replaceClientLogosWithDriveSet(sourceDir?: string): Promise<number> {
  const dir = sourceDir || path.resolve(__dirname, "../tmp-logos/files");
  const files = (await fs.readdir(dir))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort();
  if (files.length === 0) {
    throw new Error(`No logo files found in ${dir}`);
  }
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  const existing = await ClientLogo.find();
  for (const doc of existing) {
    if (doc.imagePublicId) await deleteCloudinaryImage(doc.imagePublicId);
  }
  await ClientLogo.deleteMany({});

  const docs = [];
  for (const [index, file] of files.entries()) {
    const name = logoDisplayName(file, index);
    const uploaded = await uploadClientLogoFromPath(path.join(dir, file), name);
    docs.push({
      name,
      imageUrl: uploaded.imageUrl,
      imagePublicId: uploaded.imagePublicId,
      sortOrder: index + 1,
    });
    console.log(`Uploaded ${name} (${index + 1}/${files.length})`);
  }

  await ClientLogo.insertMany(docs);
  console.log(`Replaced client logos with ${docs.length} Drive logos`);
  return docs.length;
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

async function resolveLogoSource(imageUrl: string, name: string) {
  if (!imageUrl || imageUrl.startsWith("https://res.cloudinary.com/")) return { filePath: "", slug: "" };

  const publicPath = publicFileFromUrl(imageUrl);
  const original = ORIGINALS.find(
    (item) => item.name === name || imageUrl.includes(`/${item.slug}.`),
  );

  if (publicPath && (await fileExists(publicPath))) {
    return { filePath: publicPath, slug: original?.slug || path.parse(publicPath).name };
  }
  if (!original) return { filePath: "", slug: "" };

  const assetPath = path.join(assetsDir(), original.file);
  if (await fileExists(assetPath)) return { filePath: assetPath, slug: original.slug };
  return { filePath: "", slug: "" };
}

export async function migrateClientLogosToCloudinary(): Promise<void> {
  try {
    await getCloudinary().api.ping();
  } catch (err) {
    console.error("Cloudinary ping failed. Client logos were not moved.", err);
    return;
  }

  const docs = await ClientLogo.find();
  let moved = 0;

  for (const doc of docs) {
    const source = await resolveLogoSource(doc.imageUrl, doc.name);
    if (!source.filePath) continue;
    const uploaded = await uploadClientLogoFromPath(source.filePath, source.slug || doc.name);
    await ClientLogo.updateOne(
      { _id: doc._id },
      { $set: { imageUrl: uploaded.imageUrl, imagePublicId: uploaded.imagePublicId } },
    );
    moved += 1;
  }

  if (moved > 0) console.log(`Moved ${moved} client logo(s) to Cloudinary`);
}
