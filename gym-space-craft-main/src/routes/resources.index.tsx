import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileDown, Clock } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { FaqSection, PageHero, ReelsSection } from "@/components/site/Sections";
import { blogCategories, downloads, posts as fallbackPosts, resourceFaqs } from "@/data/resources";
import { useBlogs } from "@/hooks/use-blogs";
import resourcesHero from "@/assets/gallery-1.jpg";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: "Gym Design Journal & Free Downloads | Design Diaries" },
      {
        name: "description",
        content:
          "Articles on gym planning, equipment layout, materials and wellness trends — plus free planning checklists, layout guides and budget worksheets for new gym owners.",
      },
      { property: "og:title", content: "Resources | Design Diaries" },
      {
        property: "og:description",
        content: "Articles and downloadable checklists on planning and equipping a gym floor.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResourcesListing,
});

const defaultTabs = ["All", ...blogCategories, "Downloads"] as const;

function ResourcesListing() {
  const hash = useRouterState({ select: (s) => s.location.hash });
  const { posts } = useBlogs(fallbackPosts);
  const extraCategories = [...new Set(posts.map((p) => p.category).filter((c) => !(blogCategories as readonly string[]).includes(c)))];
  const tabs = extraCategories.length ? ["All", ...blogCategories, ...extraCategories, "Downloads"] : [...defaultTabs];
  const [active, setActive] = useState<string>("All");

  useEffect(() => {
    if (hash === "downloads") setActive("Downloads");
  }, [hash]);

  const shownPosts = active === "All" ? posts : posts.filter((p) => p.category === active);
  const showDownloads = active === "All" || active === "Downloads";

  return (
    <>
      <PageHero
        label="Resources"
        title="What we've learned written down"
        intro="Planning, equipment and layout, materials and maintenance, wellness trends — plus free guides drawn straight from project work."
        image={resourcesHero}
        imageAlt="Placeholder: barbell storage against a micro-cement wall in a designed gym"
      />

      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-wrap items-center gap-3 border-b border-border pb-6">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t)}
              aria-pressed={active === t}
              className={`label-caps px-5 py-3 transition-all duration-300 active:scale-[0.98] ${
                active === t
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </Reveal>

        {active !== "Downloads" && (
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {shownPosts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <Link
                  to="/resources/blog/$slug"
                  params={{ slug: p.slug }}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={p.image}
                      alt={p.imageAlt || `Cover image — ${p.title}`}
                      loading="lazy"
                      width={1400}
                      height={1000}
                      className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="label-caps bg-secondary px-3 py-1.5 text-primary">
                      {p.category}
                    </span>
                    <span className="label-caps inline-flex items-center gap-1.5 text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {p.readTime}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                </Link>
              </Reveal>
            ))}
            {shownPosts.length === 0 && (
              <p className="text-muted-foreground">Articles in this category are on the way.</p>
            )}
          </div>
        )}

        {showDownloads && (
          <div id="downloads" className="scroll-mt-24 pt-20">
            <Reveal>
              <p className="label-caps text-primary">Downloads</p>
              <h2 className="display-lg mt-5">Guides you can work from today</h2>
              <p className="mt-6 max-w-xl text-muted-foreground">
                Each one is a working document from live project practice. You'll be asked for a
                name and email to unlock it — nothing more.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              {downloads.map((d, i) => (
                <Reveal key={d.slug} delay={i * 80}>
                  <Link
                    to="/resources/downloads/$slug"
                    params={{ slug: d.slug }}
                    className="group flex h-full flex-col border border-border bg-card transition-colors duration-500 hover:border-primary"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                      <img
                        src={d.image}
                        alt={d.title}
                        loading="lazy"
                        width={1400}
                        height={800}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6 md:p-8">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="label-caps inline-flex items-center gap-1.5 text-primary">
                          <FileDown className="h-3.5 w-3.5" /> {d.format}
                        </span>
                        {d.useTime ? (
                          <span className="label-caps inline-flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" /> {d.useTime}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-4 font-display text-2xl uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                        {d.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground">{d.summary}</p>
                      <p className="label-caps mt-6 text-muted-foreground">What it covers</p>
                      <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                        {d.covers.map((c) => (
                          <li key={c} className="flex gap-3">
                            <span className="text-primary">—</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                      <span className="label-caps link-underline mt-8 inline-block self-start text-foreground group-hover:text-primary">
                        Get the resource →
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        )}

        <p className="mt-10 text-xs text-muted-foreground">
          Placeholder imagery and draft article content — final pieces and PDFs to follow.
        </p>
      </section>

      <CtaBanner compact />

      <ReelsSection label="EXPLORE OUR INSTAGRAM" title="Shorter faster answers" placement="resources" />

      <FaqSection items={resourceFaqs} title="About these resources" />
    </>
  );
}
