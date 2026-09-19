import { env } from "./config/env";
import { connectDB } from "./config/db";
import { seedAdmin } from "./seed/admin.seed";
import { seedContactSettings } from "./seed/contact-settings.seed";
import { seedHomepageSettings } from "./seed/homepage-settings.seed";
import { seedTestimonials, backfillTestimonialSortOrder } from "./seed/testimonial.seed";
import { attachOriginalTestimonialImages, migrateTestimonialImagesToCloudinary } from "./seed/testimonial-images.seed";
import { seedClientLogos, migrateClientLogosToCloudinary } from "./seed/client-logo.seed";
import { seedAboutSettings } from "./seed/about-settings.seed";
import { seedProjects, migrateProjectImagesToCloudinary, backfillProjectReviews } from "./seed/project.seed";
import { seedRecognitions, migrateRecognitionImagesToCloudinary } from "./seed/recognition.seed";
import { seedBlogs, attachBlogPointImages, migrateBlogImagesToCloudinary } from "./seed/blog.seed";
import { seedInstagramFeed, seedWorkInstagramFeed, seedAboutInstagramFeed, seedResourcesInstagramFeed, seedServicesInstagramFeed } from "./seed/instagram-feed.seed";
import { seedCallSettings } from "./seed/call-settings.seed";
import { app } from "./app";

async function start() {
  await connectDB(env.MONGODB_URI);
  await seedAdmin();
  await seedContactSettings();
  await seedCallSettings();
  await seedHomepageSettings();
  await seedTestimonials();
  await backfillTestimonialSortOrder();
  await attachOriginalTestimonialImages();
  await seedClientLogos();
  await seedAboutSettings();
  await seedProjects();
  await backfillProjectReviews();
  try {
    await seedRecognitions();
  } catch (err) {
    console.error("Recognition seed failed", err);
  }
  try {
    await seedBlogs();
    await attachBlogPointImages();
  } catch (err) {
    console.error("Blog seed failed", err);
  }
  try {
    await seedInstagramFeed();
    await seedWorkInstagramFeed();
    await seedAboutInstagramFeed();
    await seedResourcesInstagramFeed();
    await seedServicesInstagramFeed();
  } catch (err) {
    console.error("Instagram feed seed failed", err);
  }
  try {
    await migrateTestimonialImagesToCloudinary();
  } catch (err) {
    console.error("Testimonial image migration failed", err);
  }
  try {
    await migrateClientLogosToCloudinary();
  } catch (err) {
    console.error("Client logo migration failed", err);
  }
  try {
    await migrateProjectImagesToCloudinary();
  } catch (err) {
    console.error("Project image migration failed", err);
  }
  try {
    await migrateRecognitionImagesToCloudinary();
  } catch (err) {
    console.error("Recognition image migration failed", err);
  }
  try {
    await migrateBlogImagesToCloudinary();
  } catch (err) {
    console.error("Blog image migration failed", err);
  }

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
