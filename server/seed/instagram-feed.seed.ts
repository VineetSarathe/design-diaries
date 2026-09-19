import fs from "node:fs/promises";
import path from "node:path";
import { InstagramFeed } from "../models/instagram-feed.model";
import { storeImageFromPath } from "../utils/store-image";

const DEFAULTS = [
  { caption: "Zoning a 6,000 sq ft floor", image: "gallery-1.jpg", slug: "zoning-6000-sq-ft" },
  { caption: "Why rubber thickness matters", image: "project-1.jpg", slug: "rubber-thickness" },
  { caption: "Mirror lines and sightlines", image: "project-2.jpg", slug: "mirror-lines" },
  { caption: "Cardio deck daylight study", image: "project-4.jpg", slug: "cardio-deck-daylight" },
  { caption: "Locker room throughput", image: "project-5.jpg", slug: "locker-room-throughput" },
  { caption: "Reception as a sales tool", image: "project-6.jpg", slug: "reception-sales-tool" },
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

export async function seedInstagramFeed(): Promise<void> {
  const count = await InstagramFeed.countDocuments();
  if (count > 0) return;

  const docs = [];
  for (const [index, item] of DEFAULTS.entries()) {
    const filePath = path.join(assetsDir(), item.image);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing Instagram asset: ${item.image}`);
    }
    const ext = path.extname(item.image) || ".jpg";
    const stored = await storeImageFromPath(filePath, item.slug, "instagram", `${item.slug}${ext}`);
    docs.push({
      caption: item.caption,
      link: "",
      imageUrl: stored.imageUrl,
      imagePublicId: stored.imagePublicId,
      placement: "home",
      sortOrder: index + 1,
    });
  }

  await InstagramFeed.insertMany(docs);
  console.log("Instagram feed ready");
}

const WORK_DEFAULTS = [
  { caption: "Zoning a floor in 40 seconds", image: "gallery-1.jpg", slug: "work-zoning-6200" },
  { caption: "Why we test the section, not just the plan", image: "project-5.jpg", slug: "work-section-not-plan" },
  { caption: "Turf lane placement, explained on site", image: "project-6.jpg", slug: "work-turf-lane" },
  { caption: "Material call: rubber vs. vinyl at year five", image: "case-study.jpg", slug: "work-rubber-vs-vinyl" },
] as const;

export async function seedWorkInstagramFeed(): Promise<void> {
  await InstagramFeed.updateMany(
    { $or: [{ placement: { $exists: false } }, { placement: "" }] },
    { $set: { placement: "home" } },
  );

  const workCount = await InstagramFeed.countDocuments({ placement: "work" });
  if (workCount > 0) return;

  const docs = [];
  for (const [index, item] of WORK_DEFAULTS.entries()) {
    const filePath = path.join(assetsDir(), item.image);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing Work Instagram asset: ${item.image}`);
    }
    const ext = path.extname(item.image) || ".jpg";
    const stored = await storeImageFromPath(filePath, item.slug, "instagram", `${item.slug}${ext}`);
    docs.push({
      caption: item.caption,
      link: "",
      imageUrl: stored.imageUrl,
      imagePublicId: stored.imagePublicId,
      placement: "work",
      sortOrder: index + 1,
    });
  }

  await InstagramFeed.insertMany(docs);
  console.log("Work Instagram feed ready");
}

const ABOUT_DEFAULTS = [
  { caption: "Strength floor study", image: "project-1.jpg", slug: "about-strength-floor" },
  { caption: "Wellness studio details", image: "project-2.jpg", slug: "about-wellness-studio" },
  { caption: "Movement and light", image: "project-4.jpg", slug: "about-movement-light" },
  { caption: "Material decisions", image: "gallery-1.jpg", slug: "about-material-decisions" },
] as const;

export async function seedAboutInstagramFeed(): Promise<void> {
  const aboutCount = await InstagramFeed.countDocuments({ placement: "about" });
  if (aboutCount > 0) return;

  const docs = [];
  for (const [index, item] of ABOUT_DEFAULTS.entries()) {
    const filePath = path.join(assetsDir(), item.image);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing About Instagram asset: ${item.image}`);
    }
    const ext = path.extname(item.image) || ".jpg";
    const stored = await storeImageFromPath(filePath, item.slug, "instagram", `${item.slug}${ext}`);
    docs.push({
      caption: item.caption,
      link: "",
      imageUrl: stored.imageUrl,
      imagePublicId: stored.imagePublicId,
      placement: "about",
      sortOrder: index + 1,
    });
  }

  await InstagramFeed.insertMany(docs);
  console.log("About Instagram feed ready");
}

const RESOURCES_DEFAULTS = [
  { caption: "Zoning a floor in 40 seconds", image: "gallery-1.jpg", slug: "resources-zoning-6200" },
  { caption: "Why we test the section, not just the plan", image: "project-5.jpg", slug: "resources-section-not-plan" },
  { caption: "Turf lane placement, explained on site", image: "project-6.jpg", slug: "resources-turf-lane" },
  { caption: "Material call: rubber vs. vinyl at year five", image: "case-study.jpg", slug: "resources-rubber-vs-vinyl" },
] as const;

export async function seedResourcesInstagramFeed(): Promise<void> {
  const resourcesCount = await InstagramFeed.countDocuments({ placement: "resources" });
  if (resourcesCount > 0) return;

  const docs = [];
  for (const [index, item] of RESOURCES_DEFAULTS.entries()) {
    const filePath = path.join(assetsDir(), item.image);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing Resources Instagram asset: ${item.image}`);
    }
    const ext = path.extname(item.image) || ".jpg";
    const stored = await storeImageFromPath(filePath, item.slug, "instagram", `${item.slug}${ext}`);
    docs.push({
      caption: item.caption,
      link: "",
      imageUrl: stored.imageUrl,
      imagePublicId: stored.imagePublicId,
      placement: "resources",
      sortOrder: index + 1,
    });
  }

  await InstagramFeed.insertMany(docs);
  console.log("Resources Instagram feed ready");
}

const SERVICES_DEFAULTS = [
  { caption: "Zoning a floor in 40 seconds", image: "gallery-1.jpg", slug: "services-zoning-6200" },
  { caption: "Why we test the section, not just the plan", image: "project-5.jpg", slug: "services-section-not-plan" },
  { caption: "Turf lane placement, explained on site", image: "project-6.jpg", slug: "services-turf-lane" },
  { caption: "Material call: rubber vs. vinyl at year five", image: "case-study.jpg", slug: "services-rubber-vs-vinyl" },
] as const;

export async function seedServicesInstagramFeed(): Promise<void> {
  const servicesCount = await InstagramFeed.countDocuments({ placement: "services" });
  if (servicesCount > 0) return;

  const docs = [];
  for (const [index, item] of SERVICES_DEFAULTS.entries()) {
    const filePath = path.join(assetsDir(), item.image);
    if (!(await fileExists(filePath))) {
      throw new Error(`Missing Services Instagram asset: ${item.image}`);
    }
    const ext = path.extname(item.image) || ".jpg";
    const stored = await storeImageFromPath(filePath, item.slug, "instagram", `${item.slug}${ext}`);
    docs.push({
      caption: item.caption,
      link: "",
      imageUrl: stored.imageUrl,
      imagePublicId: stored.imagePublicId,
      placement: "services",
      sortOrder: index + 1,
    });
  }

  await InstagramFeed.insertMany(docs);
  console.log("Services Instagram feed ready");
}
