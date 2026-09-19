import fs from "node:fs/promises";
import path from "node:path";
import { Recognition } from "../models/recognition.model";
import { getCloudinary } from "../config/cloudinary";
import { removeStoredImage, storeImageFromPath } from "../utils/store-image";

const DEFAULTS = [
  {
    title: "Published at IDAC Expo Delhi",
    category: "Publication",
    year: "2025",
    slug: "idac-expo-delhi-2025",
    image: "case-study.jpg",
    extras: ["project-2.jpg", "project-4.jpg"],
  },
  {
    title: "Rising Stars Awards",
    category: "Award",
    year: "2025",
    slug: "rising-stars-awards-2025",
    image: "project-4.jpg",
    extras: ["project-1.jpg", "case-study.jpg"],
  },
  {
    title: "Architects Wow Awards",
    category: "Award",
    year: "2024",
    slug: "architects-wow-awards-2024",
    image: "gallery-1.jpg",
    extras: ["project-1.jpg", "why-materials.jpg"],
  },
  {
    title: "Rising Stars Awards",
    category: "Award",
    year: "2024",
    slug: "rising-stars-awards-2024",
    image: "why-materials.jpg",
    extras: ["project-3.jpg", "gallery-1.jpg"],
  },
  {
    title: "Milap Jammu Events Hosting",
    category: "Event",
    year: "2023",
    slug: "milap-jammu-events-hosting-2023",
    image: "project-3.jpg",
    extras: ["gallery-1.jpg", "project-2.jpg"],
  },
] as const;

function assetsDir() {
  return path.resolve(__dirname, "../../gym-space-craft-main/src/assets");
}

async function fileExists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function seedRecognitions(): Promise<void> {
  const count = await Recognition.countDocuments();
  if (count > 0) return;
  console.log("Recognition collection is empty — add items in Admin > Recognition");
}

const DRIVE_CARDS = [
  { dir: "02-iconic-architecture-award-2025", title: "Iconic Architecture Award", category: "Award", year: "2025" },
  { dir: "04-published-at-idac-expo-delhi-2025", title: "Published at IDAC Expo Delhi", category: "Publication", year: "2025" },
  { dir: "06-rising-stars-awards-2025-by-lwl", title: "Rising Stars Awards by LWL", category: "Award", year: "2025" },
  { dir: "01-architect-s-wow-award-2024", title: "Architect's Wow Award", category: "Award", year: "2024" },
  { dir: "05-rising-stars-awards-2024-by-lwl", title: "Rising Stars Awards by LWL", category: "Award", year: "2024" },
  { dir: "03-milap-jammu-event-hosting-2023", title: "Milap Jammu Event Hosting", category: "Event", year: "2023" },
] as const;

export async function replaceRecognitionsWithDriveSet(sourceRoot?: string): Promise<number> {
  const root = sourceRoot || path.resolve(__dirname, "../tmp-recognition/files");
  const docs = [];

  for (const [index, card] of DRIVE_CARDS.entries()) {
    const dir = path.join(root, card.dir);
    const files = (await fs.readdir(dir))
      .filter((file) => /\.(png|jpe?g|webp|gif|heic)$/i.test(file))
      .sort();
    if (!files.length) throw new Error(`No images in ${card.dir}`);

    const slug = `${card.title} ${card.year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    const main = await storeImageFromPath(path.join(dir, files[0]), slug, "recognition", files[0]);
    const extras = [];
    for (const [extraIndex, file] of files.slice(1).entries()) {
      const stored = await storeImageFromPath(
        path.join(dir, file),
        `${slug}-${extraIndex + 2}`,
        "recognition",
        file,
      );
      extras.push({ url: stored.imageUrl, publicId: stored.imagePublicId, kind: "image" });
    }

    docs.push({
      title: card.title,
      category: card.category,
      year: card.year,
      link: "/about#recognition",
      imageUrl: main.imageUrl,
      imagePublicId: main.imagePublicId,
      images: extras,
      sortOrder: index + 1,
    });
    console.log(`Uploaded ${card.title} ${card.year} (${files.length} images)`);
  }

  const existing = await Recognition.find();
  for (const doc of existing) {
    await removeStoredImage(doc.imageUrl, doc.imagePublicId, "recognition").catch(() => undefined);
    await Promise.all(
      doc.images.map((image) => removeStoredImage(image.url, image.publicId, "recognition").catch(() => undefined)),
    );
  }
  await Recognition.deleteMany({});
  await Recognition.insertMany(docs);
  console.log(`Replaced recognition cards with ${docs.length} Drive items`);
  return docs.length;
}

function publicFileFromUrl(imageUrl: string) {
  if (!imageUrl.startsWith("/")) return "";
  return path.resolve(__dirname, "../../gym-space-craft-main/public", imageUrl.replace(/^\//, ""));
}

async function resolveSource(imageUrl: string, slugHint: string) {
  if (!imageUrl || imageUrl.startsWith("https://res.cloudinary.com/")) return "";
  const publicPath = publicFileFromUrl(imageUrl);
  if (publicPath && (await fileExists(publicPath))) return publicPath;

  const original = DEFAULTS.find(
    (item) => slugHint.includes(item.slug) || imageUrl.includes(`/${item.slug}`),
  );
  if (!original) return "";
  const assetPath = path.join(assetsDir(), original.image);
  return (await fileExists(assetPath)) ? assetPath : "";
}

export async function migrateRecognitionImagesToCloudinary(): Promise<void> {
  try {
    await getCloudinary().api.ping();
  } catch (err) {
    console.error("Cloudinary ping failed. Recognition images were not moved.", err);
    return;
  }

  const docs = await Recognition.find();
  let moved = 0;

  for (const doc of docs) {
    const slug = `${doc.title} ${doc.year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "recognition";

    const updates: {
      imageUrl?: string;
      imagePublicId?: string;
      images?: { url: string; publicId: string }[];
    } = {};

    const mainSource = await resolveSource(doc.imageUrl, slug);
    if (mainSource) {
      const uploaded = await storeImageFromPath(mainSource, slug, "recognition", `${slug}.jpg`);
      updates.imageUrl = uploaded.imageUrl;
      updates.imagePublicId = uploaded.imagePublicId;
    }

    const nextImages = [];
    for (const [index, image] of doc.images.entries()) {
      const source = await resolveSource(image.url, `${slug}-${index + 2}`);
      if (!source) {
        nextImages.push(image);
        continue;
      }
      const uploaded = await storeImageFromPath(source, `${slug}-${index + 2}`, "recognition", `${slug}-${index + 2}.jpg`);
      nextImages.push({ url: uploaded.imageUrl, publicId: uploaded.imagePublicId });
      if (uploaded.imageUrl !== image.url) moved += 1;
    }
    if (nextImages.some((image, index) => image.url !== doc.images[index]?.url)) {
      updates.images = nextImages;
    }
    if (updates.imageUrl && updates.imageUrl !== doc.imageUrl) moved += 1;

    if (Object.keys(updates).length) {
      await Recognition.updateOne({ _id: doc._id }, { $set: updates });
    }
  }

  if (moved > 0) console.log(`Moved ${moved} recognition image(s) to Cloudinary`);
}
