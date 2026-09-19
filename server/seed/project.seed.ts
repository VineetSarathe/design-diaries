import path from "node:path";
import fs from "node:fs/promises";
import { Project } from "../models/project.model";
import { getCloudinary } from "../config/cloudinary";
import { storeImageFromPath } from "../utils/store-image";
import { uploadImageFromPath } from "../utils/cloudinary-images";

const ASSETS = path.resolve(__dirname, "../../gym-space-craft-main/src/assets");

const SEED = [
  {
    slug: "iron-standard",
    name: "THE STRENGTH CULTURE",
    location: "Jammu (J&K), India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "2024",
    clientType: "STRENGTH TRAINING GYM",
    insight:
      "A strength focused gym designed as a focused training environment, with clear circulation, the right equipment clearance and an all black interior that keeps attention on the workout.",
    card: "project-1.jpg",
    extras: ["hero-gym.jpg", "gallery-1.jpg", "case-study.jpg", "floorplan.jpg"],
  },
  {
    slug: "sanctum-wellness",
    name: "A3 FITNESS GYM & SPA",
    location: "Jammu, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "3,500 sq ft",
    year: "",
    clientType: "LIFESTYLE-FOCUSED FITNESS SPACE",
    insight:
      "A lifestyle fitness space that combines cardio, Zumba, dumbbell, and strength training in a 3,500 sq ft space, creating distinct zones without closing it off.",
    card: "project-2.jpg",
    extras: ["project-5.jpg", "gallery-1.jpg", "floorplan.jpg"],
  },
  {
    slug: "north-block-strength",
    name: "FIT FIRST GYM",
    location: "Rajkot, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "FITNESS ARENA",
    insight:
      "A large-scale fitness arena, designed remotely from Delhi with the scale and volume of the floor to create an expansive training environment while meticulously controlling light, music and HVAC across zones.",
    card: "project-6.jpg",
    extras: ["gallery-1.jpg", "floorplan.jpg"],
  },
  {
    slug: "rep-house-cycle",
    name: "THE BODY MOVE FITNESS",
    location: "New Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "CLUB-BASED FITNESS SPACE",
    insight:
      "A nature-inspired fitness space designed for a multi-age club audience, replacing the typical dark gym aesthetic with natural materials, organic forms and views of the surrounding greenery.",
    card: "project-4.jpg",
    extras: ["project-5.jpg", "gallery-1.jpg", "floorplan.jpg"],
  },
  {
    slug: "forge-24",
    name: "A3 FITNESS GYM 2",
    location: "",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "EXPANDED FITNESS GYM",
    insight:
      "A larger fitness space created from a former car garage, using existing elements, sectional ceilings and zone-specific lighting to turn a challenging shell into a more premium gym environment.",
    card: "project-3.jpg",
    extras: ["project-6.jpg", "case-study.jpg", "floorplan.jpg"],
  },
  {
    slug: "still-house-recovery",
    name: "DAWN'S GYM",
    location: "Amritsar, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "LUXURY MULTI-FLOOR GYM",
    insight:
      "A multi-story luxury gym that unites women’s training, strength training, crossfit, reception and hospitality spaces into one cohesive design language.",
    card: "project-5.jpg",
    extras: ["project-2.jpg", "floorplan.jpg"],
  },
  {
    slug: "fitness-manzil-gym",
    name: "FITNESS MANZIL GYM",
    location: "South Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "PREMIUM FITNESS GYM",
    insight:
      "A premium basement gym planned around limited natural light, bringing cardio and studio training together while using light finishes and content-focused design elements to strengthen the brand.",
    card: "case-study.jpg",
    extras: ["project-1.jpg", "gallery-1.jpg", "floorplan.jpg"],
  },
  {
    slug: "outwork-fitness-gym",
    name: "OUTWORK FITNESS GYM",
    location: "South Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR DESIGN PROJECTS",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "TWO-FLOOR FITNESS GYM",
    insight:
      "A two-floor fitness space designed around two distinct training audiences, using contrasting interiors to give each floor its own identity while keeping the brand connected.",
    card: "project-4.jpg",
    extras: ["project-6.jpg", "project-3.jpg", "floorplan.jpg"],
  },
] as const;

const PLACEHOLDER_QUOTES = new Set([
  "Sagrika asked about our class timings and trainer roster before she asked about colours. That is why the floor works at 7am.",
  "We were told we would have to pick one format. We run both, at the same time.",
  "Same shelf, same stock, different position. It sells now.",
  "Nine more bikes per class changed the maths of the whole business.",
  "The night shift is our busiest quiet hour. The floor holds up without anyone watching it.",
  "Our cleaning routine went from an hour to twenty minutes.",
  "The basement no longer feels like a basement.",
  "The constraints became the plan.",
]);

const PROJECT_REVIEWS: Record<string, { quote: string; author: string; role: string }> = {
  "iron-standard": {
    quote:
      "The Strength Culture is more than just a gym. We had a bucket of ideas and Sagrika helped us turn it into something much bigger than we ever thought possible. Her work was so much more than we expected and we are so thankful to Design Diaries by Sagrika.",
    author: "Arushi Kajaria",
    role: "The Strength Culture",
  },
  "sanctum-wellness": {
    quote: "The best interior designer I have come across. She designed my gym, A3 Fitness, well beyond my expectations. Kudos to her.",
    author: "Aastik Khajuria",
    role: "A3 Gym",
  },
  "north-block-strength": {
    quote: "We wanted a bigger and better gym. Despite managing the project remotely, Sagrika made the process smooth and the final gym came out just as we wanted.",
    author: "Owner",
    role: "FIT FIRST GYM",
  },
  "rep-house-cycle": {
    quote: "It was a bigger project for me and after talking to Sagrika, I decided to give it a try. It was more than we had thought. She was there to help with every detail from the beginning to the end and was always available when we needed her. She made sure we got the right things done the right way.",
    author: "Owner",
    role: "The Body Move Fitness",
  },
  "forge-24": {
    quote: "We wanted a bigger gym but also wanted to reuse things from our previous space. Sagrika made it all work beautifully and turned the old garage-like space into a premium gym.",
    author: "Owner",
    role: "A3 FITNESS GYM 2",
  },
  "still-house-recovery": {
    quote: "We wanted a gym with different training areas on different floors. Sagrika brought it all together and gave the entire gym a uniform look.",
    author: "Owner",
    role: "DAWN'S GYM",
  },
  "fitness-manzil-gym": {
    quote: "We wanted a premium gym to elevate our brand. Sagrika used the basement space to its full potential and created a gym that feels different and memorable.",
    author: "Owner",
    role: "FITNESS MANZIL GYM",
  },
  "outwork-fitness-gym": {
    quote: "I wanted to do something different from any other commercial gym, especially with natural light and a different look. I saw Sagrika's work on Instagram and knew she understood what I was looking for. I am really pleased with the outcome and very grateful to her for creating such a beautiful space.",
    author: "Owner",
    role: "OUTWORK FITNESS GYM",
  },
};

export async function seedProjects(): Promise<void> {
  for (const [index, item] of SEED.entries()) {
    const exists = await Project.findOne({ slug: item.slug });
    if (exists) continue;
    const card = await storeImageFromPath(
      path.join(ASSETS, item.card),
      `${item.slug}-card`,
      "projects",
      `${item.slug}-card${path.extname(item.card)}`,
    );
    const images = [];
    for (const [extraIndex, file] of item.extras.entries()) {
      const uploaded = await storeImageFromPath(
        path.join(ASSETS, file),
        `${item.slug}-${extraIndex + 1}`,
        "projects",
        `${item.slug}-${extraIndex + 1}${path.extname(file)}`,
      );
      images.push({
        url: uploaded.imageUrl,
        publicId: uploaded.imagePublicId,
        alt: "",
        caption: "",
      });
    }

    await Project.create({
      slug: item.slug,
      name: item.name,
      location: item.location,
      category: item.category,
      area: item.area,
      year: item.year,
      clientType: item.clientType,
      cardLabel: item.cardLabel,
      hideCardMeta: item.hideCardMeta,
      insight: item.insight,
      reviewQuote: PROJECT_REVIEWS[item.slug]?.quote || "",
      reviewAuthor: PROJECT_REVIEWS[item.slug]?.author || "",
      reviewRole: PROJECT_REVIEWS[item.slug]?.role || "",
      cardUrl: card.imageUrl,
      cardPublicId: card.imagePublicId,
      images,
      sortOrder: index + 1,
    });
  }

  const count = await Project.countDocuments();
  if (count > 0) console.log("Projects ready");
}

export async function backfillProjectReviews(): Promise<void> {
  const docs = await Project.find({ slug: { $in: Object.keys(PROJECT_REVIEWS) } });
  if (!docs.length) return;

  await Promise.all(
    docs.map((doc) => {
      const review = PROJECT_REVIEWS[doc.slug];
      if (!review) return Promise.resolve();
      const isPlaceholder =
        !doc.reviewQuote ||
        PLACEHOLDER_QUOTES.has(doc.reviewQuote) ||
        doc.reviewAuthor === "Placeholder Client" ||
        (doc.slug === "iron-standard" && doc.reviewAuthor === "The Strength Culture");
      if (!isPlaceholder && doc.reviewQuote === review.quote && doc.reviewAuthor === review.author) {
        return Promise.resolve();
      }
      if (!isPlaceholder && doc.reviewQuote !== review.quote) return Promise.resolve();
      return Project.updateOne(
        { _id: doc._id },
        {
          $set: {
            reviewQuote: review.quote,
            reviewAuthor: review.author,
            reviewRole: review.role,
          },
        },
      );
    }),
  );
}

function publicFileFromUrl(imageUrl: string) {
  if (!imageUrl.startsWith("/")) return "";
  return path.resolve(__dirname, "../../gym-space-craft-main/public", imageUrl.replace(/^\//, ""));
}

async function uploadLocalToCloudinary(imageUrl: string, name: string) {
  if (!imageUrl || imageUrl.startsWith("https://res.cloudinary.com/")) {
    return null;
  }
  const filePath = publicFileFromUrl(imageUrl);
  if (!filePath) return null;
  try {
    await fs.access(filePath);
  } catch {
    return null;
  }
  return uploadImageFromPath(filePath, name, "projects");
}

export async function migrateProjectImagesToCloudinary(): Promise<void> {
  try {
    await getCloudinary().api.ping();
  } catch (err) {
    console.error("Cloudinary ping failed. Project images were not moved.", err);
    return;
  }

  const docs = await Project.find();
  let moved = 0;

  for (const doc of docs) {
    let changed = false;
    const card = await uploadLocalToCloudinary(doc.cardUrl, `${doc.slug}-card`);
    if (card) {
      doc.cardUrl = card.imageUrl;
      doc.cardPublicId = card.imagePublicId;
      changed = true;
    }

    const nextImages = [];
    for (const [index, image] of doc.images.entries()) {
      const uploaded = await uploadLocalToCloudinary(image.url, `${doc.slug}-${index + 1}`);
      if (uploaded) {
        nextImages.push({
          url: uploaded.imageUrl,
          publicId: uploaded.imagePublicId,
          alt: image.alt,
          caption: image.caption,
        });
        changed = true;
      } else {
        nextImages.push(image);
      }
    }
    if (changed) {
      await Project.updateOne(
        { _id: doc._id },
        {
          $set: {
            cardUrl: doc.cardUrl,
            cardPublicId: doc.cardPublicId,
            images: nextImages,
          },
        },
      );
      moved += 1;
    }
  }

  if (moved > 0) console.log(`Moved ${moved} project(s) to Cloudinary`);
}
