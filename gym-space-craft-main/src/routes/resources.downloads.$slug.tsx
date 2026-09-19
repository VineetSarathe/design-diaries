import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Clock, FileDown } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { ReelsSection } from "@/components/site/Sections";
import { DownloadForm } from "@/components/site/DownloadForm";
import { downloads, getDownload, type Download } from "@/data/resources";

export const Route = createFileRoute("/resources/downloads/$slug")({
  loader: ({ params }) => {
    const item = getDownload(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Resource not found | Design Diaries" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const d = loaderData.item;
    const title = `${d.title} | Design Diaries`;
    return {
      meta: [
        { title },
        { name: "description", content: d.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: d.summary },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DownloadDetail,
});

function DownloadDetail() {
  const { item } = Route.useLoaderData() as { item: Download };
  const others = downloads.filter((d) => d.slug !== item.slug).slice(0, 3);

  return (
    <>
      {/* Banner */}
      <section className="relative flex min-h-[52svh] items-end overflow-hidden bg-foreground">
        <img
          src={item.image}
          alt={`Placeholder banner — ${item.title}`}
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="relative mx-auto w-full max-w-[110rem] px-5 pt-32 pb-14 text-background md:px-10 md:pb-20">
          <Reveal>
            <Link
              to="/resources"
              hash="downloads"
              className="label-caps link-underline text-background/70 hover:text-primary"
            >
              ← All downloads
            </Link>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="label-caps inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-primary-foreground">
                <FileDown className="h-3.5 w-3.5" /> {item.format}
              </span>
              <span className="label-caps inline-flex items-center gap-1.5 text-background/70">
                <Clock className="h-3.5 w-3.5" /> {item.useTime}
              </span>
            </div>
            <h1 className="display-lg mt-5 max-w-4xl">{item.title}</h1>
          </Reveal>
        </div>
      </section>

      {/* Body + gated form */}
      <section className="mx-auto grid max-w-[110rem] gap-14 px-5 py-20 md:px-10 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:gap-24">
        <Reveal>
          <p className="font-display text-2xl leading-snug md:text-3xl">{item.summary}</p>
          {item.body.map((para) => (
            <p key={para} className="mt-6 text-lg leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}

          <h2 className="mt-12 font-display text-2xl uppercase">What's inside</h2>
          <ul className="mt-6 space-y-4">
            {item.covers.map((c) => (
              <li key={c} className="flex gap-4 border-t border-border pt-4">
                <span className="text-primary">—</span>
                <span className="text-muted-foreground">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-xs text-muted-foreground">
            Placeholder resource — the real PDF replaces this file before launch.
          </p>
        </Reveal>

        <Reveal delay={120} className="lg:sticky lg:top-28 lg:self-start">
          <DownloadForm resource={item.title} />
        </Reveal>
      </section>

      {/* Other downloads */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-lg">More guides</h2>
            <Link to="/resources" hash="downloads" className="label-caps link-underline hover:text-primary">
              All downloads
            </Link>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {others.map((d, i) => (
              <Reveal key={d.slug} delay={i * 80}>
                <Link
                  to="/resources/downloads/$slug"
                  params={{ slug: d.slug }}
                  className="group block border border-border bg-background p-6 transition-colors duration-500 hover:border-primary md:p-8"
                >
                  <p className="label-caps text-primary">{d.format}</p>
                  <h3 className="mt-4 font-display text-xl uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                    {d.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">{d.summary}</p>
                  <p className="label-caps mt-6 text-muted-foreground">{d.useTime}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        label="Start a Project"
        title="Past what a checklist can answer?"
        body="Send the area, the city and what you plan to run in it. We'll tell you what the space can realistically hold."
      />

      <ReelsSection placement="resources" />
    </>
  );
}
