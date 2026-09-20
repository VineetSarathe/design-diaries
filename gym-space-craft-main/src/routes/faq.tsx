import { createFileRoute } from "@tanstack/react-router";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqSection } from "@/components/site/Sections";
import { generalFaqs, startFaqs } from "@/data/company";
import { projectFaqs } from "@/data/projects";
import { resourceFaqs } from "@/data/resources";
import { partnerFaqs, serviceFaqs } from "@/data/services";

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
  head: () => ({
    meta: [
      { title: "Gym Interior Design FAQ | Design Diaries" },
      {
        name: "description",
        content:
          "Remote clients, timelines, scope, process and what to prepare — the questions gym owners ask before starting an interior design project.",
      },
      { property: "og:title", content: "FAQ | Design Diaries" },
      {
        property: "og:description",
        content: "Scope, drawings, timelines and process questions answered.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
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
