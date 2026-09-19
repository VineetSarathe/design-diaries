import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { generalFaqs } from "@/data/company";

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
          mainEntity: generalFaqs.map((f) => ({
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
      <section className="mx-auto max-w-[110rem] px-5 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16">
        <Reveal>
          <p className="label-caps text-primary">FAQ</p>
          <h1 className="display-lg mt-5 max-w-4xl">Questions worth asking</h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Scope timelines, remote projects and where design ends and execution begins — answered
            the way we'd answer them on a call.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 pb-20 md:px-10 md:pb-28">
        <div className="max-w-4xl">
          {generalFaqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group border-t border-border py-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-xl uppercase transition-colors duration-300 hover:text-primary">
                  {f.q}
                  <span className="text-primary transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-muted-foreground">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Still deciding? Start with the call"
        body="Thirty minutes on your space, your model and your peak hour — you'll leave with a clearer view either way."
        cta="Start a Project"
      />
    </>
  );
}
