import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Clock } from "lucide-react";
import { Reveal, useInView } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { ReelsSection } from "@/components/site/Sections";
import { Statement } from "@/components/site/Statement";
import { CinematicHero, DarkBand, Seam } from "@/components/site/PageKit";
import { getPost, posts as fallbackPosts, type BlogPost, BLOG_AUTHOR } from "@/data/resources";
import { API_BASE } from "@/lib/api";
import { cmsToPosts, type CmsBlog } from "@/lib/cms-blog";
import { useProjects } from "@/hooks/use-projects";
import {
  SITE_NAME,
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLdScript,
  resolveBlogSeo,
} from "@/lib/seo";
import gallery1 from "@/assets/gallery-1.jpg";
import floorplan from "@/assets/floorplan.jpg";
import caseImg from "@/assets/case-study.jpg";
import materials from "@/assets/why-materials.jpg";
import layout from "@/assets/gym-layout.jpg";
import heroCtaVideo from "@/assets/hero-cta.mp4";

async function loadPost(slug: string): Promise<{ post: BlogPost; related: BlogPost[] }> {
  const base = API_BASE;
  let fromCms = false;
  try {
    const res = await fetch(`${base}/blogs`);
    if (res.ok) {
      const data = (await res.json()) as { ok?: boolean; posts?: CmsBlog[] };
      if (data.ok && data.posts?.length) {
        fromCms = true;
        const all = cmsToPosts(data.posts);
        const post = all.find((item) => item.slug === slug);
        if (!post) throw notFound();
        return { post, related: all.filter((item) => item.slug !== slug).slice(0, 3) };
      }
    }
  } catch (err) {
    if (fromCms) throw err;
  }
  const post = getPost(slug);
  if (!post) throw notFound();
  return { post, related: fallbackPosts.filter((item) => item.slug !== slug).slice(0, 3) };
}

export const Route = createFileRoute("/resources/blog/$slug")({
  loader: ({ params }) => loadPost(params.slug),
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Article not found | Design Diaries" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.post;
    const seo = resolveBlogSeo(p);
    const published = p.createdAt || undefined;
    const modified = p.updatedAt || p.createdAt || undefined;
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { name: "keywords", content: seo.keywords },
        { name: "author", content: SITE_NAME },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:locale", content: "en_IN" },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: seo.url },
        ...(seo.image
          ? [
              { property: "og:image", content: seo.image },
              { property: "og:image:alt", content: seo.imageAlt },
            ]
          : []),
        { property: "article:section", content: p.category },
        ...(published ? [{ property: "article:published_time", content: published }] : []),
        ...(modified ? [{ property: "article:modified_time", content: modified }] : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.description },
        ...(seo.image ? [{ name: "twitter:image", content: seo.image }] : []),
      ],
      links: [{ rel: "canonical", href: seo.url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: seo.description,
            image: seo.image ? [seo.image] : undefined,
            datePublished: published,
            dateModified: modified,
            articleSection: p.category,
            keywords: seo.keywords,
            author: { "@type": "Organization", name: SITE_NAME },
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              logo: { "@type": "ImageObject", url: absoluteUrl("/favicon.png") },
            },
            mainEntityOfPage: { "@type": "WebPage", "@id": seo.url },
            url: seo.url,
          }),
        },
        jsonLdScript(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: p.title, path: `/resources/blog/${p.slug}` },
          ]),
        ),
      ],
    };
  },
  component: BlogDetail,
});

/** Thin orange bar showing how far through the article the reader is. */
function ReadingProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setPct(h > 0 ? Math.min(100, Math.max(0, (window.scrollY / h) * 100)) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

const sectionArt = [materials, floorplan, layout, gallery1, caseImg];

function BlogDetail() {
  const { post, related } = Route.useLoaderData() as { post: BlogPost; related: BlogPost[] };
  const { getProject } = useProjects();
  const project = getProject(post.projectSlug);
  const { ref: bodyRef, visible: bodyVisible } = useInView<HTMLDivElement>(0.05);
  const [active, setActive] = useState("0");

  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.chapter ?? "0");
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [post.slug]);

  return (
    <>
      <ReadingProgress />

      <CinematicHero
        key={post.slug}
        label={post.category}
        title={post.title}
        image={post.image}
        imageAlt={post.imageAlt || `Cover image — ${post.title}`}
        meta={[
          { k: "Read", v: post.readTime },
          { k: "Category", v: post.category },
        ]}
      >
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/resources"
            className="label-caps link-underline text-background/70 hover:text-primary"
          >
            All resources
          </Link>
          <span className="label-caps inline-flex items-center gap-1.5 text-background/60">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
        </div>
      </CinematicHero>

      {/* Article body — dark, centred, with a live chapter rail */}
      <DarkBand>
        <div
          ref={bodyRef}
          className="grid gap-14 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20"
        >
          {/* Chapter rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="label-caps text-background/45">In this piece</p>
              <ul className="mt-6 space-y-4">
                {post.body.map((s, i) => {
                  const sectionOn = active === String(i) || active.startsWith(`${i}-`);
                  return (
                    <li key={s.heading}>
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden
                          className={`mt-2 block h-px shrink-0 transition-all duration-500 ${
                            sectionOn && !s.points?.length ? "w-8 bg-primary" : "w-4 bg-background/25"
                          }`}
                        />
                        <span
                          className={`text-[0.8rem] leading-snug uppercase transition-colors duration-500 ${
                            sectionOn ? "text-primary" : "text-background/45"
                          }`}
                        >
                          {s.heading}
                        </span>
                      </div>
                      {s.points?.some((pt) => pt.heading && pt.text) ? (
                        <ul className="mt-3 ml-7 space-y-2.5">
                          {s.points.map((pt, j) => {
                            if (!pt.heading || !pt.text) return null;
                            const pointOn = active === `${i}-${j}`;
                            return (
                              <li key={pt.heading} className="flex items-start gap-2">
                                <ArrowRight
                                  aria-hidden
                                  className={`mt-0.5 h-3 w-3 shrink-0 transition-colors duration-500 ${
                                    pointOn ? "text-primary" : "text-background/45"
                                  }`}
                                />
                                <span
                                  className={`text-[0.7rem] leading-snug uppercase transition-colors duration-500 ${
                                    pointOn ? "text-primary" : "text-background/45"
                                  }`}
                                >
                                  {pt.heading}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          <article className="max-w-3xl text-left">
            <Reveal>
              <p className="font-display text-xl leading-snug uppercase md:text-2xl">
                {post.excerpt}
              </p>
              <span aria-hidden className="mt-8 block h-px w-16 bg-primary" />
            </Reveal>

            <div className="mt-10">
              {post.body.map((s, i) => (
                <div
                  key={s.heading}
                  data-chapter={s.points?.length ? undefined : String(i)}
                  className="border-t border-background/15 py-12"
                >
                  <div
                    style={{ transitionDelay: `${i * 60}ms` }}
                    className={`transition-all duration-700 ease-out ${
                      bodyVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                  >
                    <div data-chapter={s.points?.length ? String(i) : undefined}>
                      <h2 className="font-display text-xl uppercase leading-tight">
                        {s.heading}
                      </h2>
                      {s.text ? (
                        <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-background/70">
                          {s.text}
                        </p>
                      ) : null}
                    </div>
                    {s.points?.length ? (
                      <div className="mt-8 max-w-2xl space-y-8 pl-8 md:pl-12">
                        {s.points.map((pt, j) => {
                          const imageOnly = Boolean(pt.image) && !pt.text;
                          return (
                            <div
                              key={pt.heading || `${i}-${j}`}
                              data-chapter={imageOnly ? undefined : `${i}-${j}`}
                            >
                              {!imageOnly ? (
                                <>
                                  <h3 className="flex items-center gap-3 font-display text-lg uppercase leading-tight">
                                    <ArrowRight className="h-5 w-5 shrink-0 text-primary" strokeWidth={2.25} />
                                    {pt.heading}
                                  </h3>
                                  <p className="mt-3 leading-relaxed text-background/70">{pt.text}</p>
                                </>
                              ) : null}
                              {pt.image ? (
                                <figure className={`group overflow-hidden border border-background/15 ${imageOnly ? "mt-0" : "mt-6"}`}>
                                  <img
                                    src={pt.image}
                                    alt={imageOnly ? pt.heading : `Supporting visual — ${pt.heading}`}
                                    loading="lazy"
                                    width={1200}
                                    height={750}
                                    className="aspect-[16/10] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                                  />
                                </figure>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>

                  {!post.body.some((b) => b.points?.length) && i % 2 === 1 ? (
                    <figure className="group mx-auto mt-10 max-w-2xl overflow-hidden border border-background/15">
                      <img
                        src={sectionArt[i % sectionArt.length]}
                        alt={`Supporting visual — ${s.heading}`}
                        loading="lazy"
                        width={1200}
                        height={750}
                        className="aspect-[16/10] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                      />
                    </figure>
                  ) : null}
                </div>
              ))}
              {post.highlight ? (
                <div className="border-t border-background/15 py-12">
                  <p className="font-display text-2xl leading-snug uppercase text-primary md:text-3xl whitespace-pre-line">
                    {post.highlight}
                  </p>
                  <span aria-hidden className="mt-8 block h-px w-16 bg-primary" />
                </div>
              ) : null}
            </div>
            <p className="label-caps mt-8 text-background/55">{BLOG_AUTHOR}</p>
          </article>
        </div>
      </DarkBand>

      <Statement words={["Read", "Plan", "Build better"]} tone="ink" />

      <Seam to="cream" />

      {/* Linked project */}
      {project && (
        <section className="blend-cream-bottom">
          <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
            <Reveal className="grid items-center gap-10 md:grid-cols-2">
              <div className="group overflow-hidden">
                <img
                  src={project.card}
                  alt={`${project.name}, ${project.location}`}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-[5/4] w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div>
                <p className="label-caps text-primary">Seen on a project</p>
                <h2 className="display-lg mt-4">
                  {project.name} {project.location}
                </h2>
                <p className="mt-4 max-w-xl text-muted-foreground">{project.insight}</p>
                <Link
                  to="/work/$slug"
                  params={{ slug: project.slug }}
                  className="label-caps link-underline mt-7 inline-block hover:text-primary"
                >
                  Read the case study
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related articles */}
      <section className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display-lg">Related reading</h2>
          <Link to="/resources" className="label-caps link-underline hover:text-primary">
            All resources
          </Link>
        </Reveal>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80}>
              <Link to="/resources/blog/$slug" params={{ slug: p.slug }} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={p.image}
                    alt={`Cover image — ${p.title}`}
                    loading="lazy"
                    width={1400}
                    height={1000}
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/35"
                  />
                  <span
                    aria-hidden
                    className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-background/50 text-background opacity-0 transition-all duration-300 group-hover:opacity-100"
                  >
                    <ArrowUpRight size={16} />
                  </span>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-primary transition-all duration-700 group-hover:w-full"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="label-caps text-primary">{p.category}</span>
                  <span className="label-caps text-muted-foreground">{p.readTime}</span>
                </div>
                <h3 className="mt-3 font-display text-lg uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                  {p.title}
                </h3>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        compact
        label="Start a Project"
        title="SEE THE SPACE BEFORE IT IS BUILT"
        body="Thinking gym, fitness studio, or wellness project? Let’s talk about your space, your needs, and what you want to build."
        video={heroCtaVideo}
      />

      <ReelsSection placement="resources" />
    </>
  );
}
