import { PAGE_SEO_PAGES } from "../lib/page-seo-pages";
import { PageSeo } from "../models/page-seo.model";

export async function seedPageSeo() {
  await Promise.all(
    PAGE_SEO_PAGES.map((page) =>
      PageSeo.updateOne(
        { key: page.key },
        { $setOnInsert: { key: page.key, path: page.path, seoTitle: "", seoDescription: "", seoKeywords: "", seoCanonical: "" } },
        { upsert: true },
      ),
    ),
  );
}
