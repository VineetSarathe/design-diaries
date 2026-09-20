import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqSection } from "@/components/site/Sections";
import { generalFaqs, startFaqs } from "@/data/company";
import { projectFaqs } from "@/data/projects";
import { resourceFaqs } from "@/data/resources";
import { partnerFaqs, serviceFaqs } from "@/data/services";
import { faqPageJsonLd } from "@/lib/seo";
import { loadRouteSeo, routePageSeo } from "@/lib/page-seo";

function allSiteFaqs() {
  const seen = new Set<string>();
  const items: { q: string; a: string }[] = [];
  for (const item of [...serviceFaqs, ...projectFaqs, ...resourceFaqs, ...startFaqs, ...partnerFaqs, ...generalFaqs]) {
    const key = item.q.replace(/^\d+\.\s*/, "").trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    items.push({ q: item.q.replace(/^\d+\.\s*/, "").trim(), a: item.a });
  }
  return items;
}

const faqs = allSiteFaqs();

export const Route = createFileRoute("/faq")({
  loader: () => loadRouteSeo("/faq"),
  head: ({ loaderData }) =>
    routePageSeo("/faq", { jsonLd: [faqPageJsonLd(faqs)] }, loaderData),
  component: FaqPage,
});

function FaqPage() {
  return (
    <>
      <div className="pt-16 md:pt-20">
        <FaqSection items={faqs} title="" />
      </div>

      <CtaBanner
        compact
        title="Still deciding? Start with the call"
        body="Thirty minutes on your space, your model and your peak hour — you'll leave with a clearer view either way."
        cta="Start a Project"
      />
    </>
  );
}
