import { Testimonial } from "../models/testimonial.model";

const DEFAULTS = [
  {
    name: "Owner",
    company: "Iron Standard, Indore",
    designation: "Commercial Gym",
    testimonial:
      "She asked about our peak-hour headcount before she asked about finishes. That's when I knew the layout would actually hold up.",
    rating: 5,
  },
  {
    name: "Founder",
    company: "Forge 24, Bhopal",
    designation: "Strength Club",
    testimonial:
      "Circulation and equipment placement were solved before a single material was chosen. Nothing felt like an afterthought.",
    rating: 5,
  },
  {
    name: "Founder",
    company: "Sanctum Wellness, Pune",
    designation: "Wellness Studio",
    testimonial:
      "Functional, calm and built for long-term growth. Rare to find a designer who understands both design and the business of fitness.",
    rating: 5,
  },
  {
    name: "Founder",
    company: "Athlete Lab, Bengaluru",
    designation: "Athlete Performance",
    testimonial:
      "They don't just design a gym, they design a community experience. The impact is visible in member engagement.",
    rating: 5,
  },
];

export async function seedTestimonials(): Promise<void> {
  const count = await Testimonial.countDocuments();
  if (count > 0) return;

  await Testimonial.insertMany(
    DEFAULTS.map((item, index) => ({
      ...item,
      imageUrl: "",
      imagePublicId: "",
      sortOrder: index + 1,
      createdAt: new Date(Date.now() + index * 1000),
    })),
  );
  console.log("Testimonials ready");
}

export async function backfillTestimonialSortOrder(): Promise<void> {
  const docs = await Testimonial.find().sort({ createdAt: 1 }).lean();
  const orders = docs.map((doc) => Number(doc.sortOrder) || 0);
  const unique = new Set(orders.filter((value) => value > 0));
  if (docs.length > 0 && unique.size === docs.length) return;

  await Promise.all(
    docs.map((doc, index) => Testimonial.updateOne({ _id: doc._id }, { $set: { sortOrder: index + 1 } })),
  );
}
