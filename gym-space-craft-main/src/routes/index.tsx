import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Clock, Play } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { TrustedBy } from "@/components/site/TrustedBy";
import { CountUp } from "@/components/site/CountUp";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { EnquiryPopup } from "@/components/site/EnquiryPopup";
import { WhyGymZones } from "@/components/site/WhyGymZones";
import { ProjectShowcase } from "@/components/site/ProjectShowcase";
import { toProjectCardData } from "@/components/site/ProjectCard";
import { useProjects } from "@/hooks/use-projects";
import { useBlogs } from "@/hooks/use-blogs";
import { Recognition } from "@/components/site/Recognition";
import { Statement } from "@/components/site/Statement";
import { SagrikaMethod } from "@/components/site/SagrikaMethod";
import { AboutSagrika } from "@/components/site/AboutSagrika";
import { CaseStudySpotlight } from "@/components/site/CaseStudySpotlight";
import { useHomepageSettings } from "@/hooks/use-homepage-settings";
import { useRecognitions } from "@/hooks/use-recognitions";
import { isExternalHref, pickBySlugs } from "@/lib/homepage";

import heroImg from "@/assets/hero-gym.jpg";
import heroVideo from "@/assets/hero-gym.mp4.asset.json";
import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import caseImg from "@/assets/case-study.jpg";
import founderImg from "@/assets/founder.webp";
import gallery1 from "@/assets/gallery-1.jpg";
import materials from "@/assets/why-materials.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gym Interior Design Studio in Indore | Design Diaries" },
      {
        name: "description",
        content:
          "Design Diaries is a specialist gym and fitness interior design studio in Indore. 15+ gyms designed around equipment logic, circulation, durability and business impact.",
      },
      { property: "og:title", content: "Gyms, Designed to Perform | Design Diaries" },
      {
        property: "og:description",
        content:
          "We specialise in fitness and gym interior design, shaped around movement, performance and the people who use them.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  { k: "Understand", d: "Know your people, goals and opportunities." },
  { k: "Research", d: "Study the context, user behaviour and spatial possibilities." },
  { k: "Plan", d: "Develop a clear spatial and functional strategy." },
  { k: "Design", d: "Bring the vision to life with intentional aesthetic design." },
  { k: "Build", d: "Oversee the design intent through execution and attention to detail." },
  { k: "Learn", d: "Measure. Refine. Evolve. With every project." },
];

const recognitionFallback: Array<{
  number: string;
  image: string;
  images?: string[];
  title: string;
  category: string;
  year: string;
  link: string;
}> = [];

const testimonialFallbackImages = [p1, p3, p2, p4];

function HomeCta({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href as "/"} className={className}>
      {children}
    </Link>
  );
}

function Home() {
  const home = useHomepageSettings();
  const { items: recognition } = useRecognitions(recognitionFallback);
  const { projects: workProjects } = useProjects();
  const { posts } = useBlogs();
  const [stage, setStage] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const featuredProjects = pickBySlugs(workProjects, home.featuredProjectSlugs).map(toProjectCardData);
  const featuredBlogs = pickBySlugs(posts, home.featuredBlogSlugs);
  const reviews = useMemo(
    () =>
      workProjects
        .filter((project) => project.testimonial?.quote)
        .map((project) => ({
          id: project.slug,
          name: project.testimonial.author,
          company: project.testimonial.role,
          designation: project.clientType || project.cardLabel || "",
          testimonial: project.testimonial.quote,
          rating: 5,
          imageUrl: project.card || project.hero || "",
        })),
    [workProjects],
  );
  const featured = reviews[0];
  const supporting = reviews.slice(1);
  const supportingTrackRef = useRef<HTMLDivElement>(null);
  const [supportingMaxHeight, setSupportingMaxHeight] = useState<number>();

  useEffect(() => {
    const a = setTimeout(() => setStage(1), 120);
    const b = setTimeout(() => setStage(2), 800);
    const c = setTimeout(() => setStage(3), 1400);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
      clearTimeout(c);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const track = supportingTrackRef.current;
    if (!track) return;

    const update = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const visible = cards.slice(0, 3);
      if (!visible.length) {
        setSupportingMaxHeight(undefined);
        return;
      }
      const first = visible[0];
      const last = visible[visible.length - 1];
      setSupportingMaxHeight(last.offsetTop + last.offsetHeight - first.offsetTop);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    Array.from(track.children).forEach((child) => observer.observe(child));

    const onWheel = (event: WheelEvent) => {
      const atTop = track.scrollTop <= 1;
      const atBottom = track.scrollTop + track.clientHeight >= track.scrollHeight - 1;
      if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) {
        event.preventDefault();
        window.scrollBy({ top: event.deltaY });
      }
    };
    track.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      observer.disconnect();
      track.removeEventListener("wheel", onWheel);
    };
  }, [workProjects]);

  return (
    <>
      <EnquiryPopup />

      {/* 01 — Performance-led hero with gym video */}
      <section className="relative flex min-h-[80svh] items-center overflow-hidden bg-foreground pt-24">
        <div
          className="absolute inset-0"
          style={{ transform: `translateY(${Math.min(scrollY * 0.18, 160)}px)` }}
        >
          <video
            src={heroVideo.url}
            poster={heroImg}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="h-full w-full scale-105 object-cover transition-[opacity,transform] duration-[1800ms] ease-out"
            style={{ opacity: stage >= 2 ? 0.72 : 0 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/75 via-foreground/30 to-foreground" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/65 via-transparent to-foreground/35" />

        <div className="relative mx-auto w-full max-w-[110rem] px-5 py-24 text-background md:px-10 md:py-32">
          <div
            className="mx-auto max-w-5xl text-center transition-all duration-1000 ease-out"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? "none" : "translateY(28px)",
            }}
          >
            <p className="label-caps inline-flex items-center border border-background/25 bg-foreground/45 px-4 py-2 text-background/75 backdrop-blur-md">
              <span className="mr-3 h-1.5 w-1.5 rounded-full bg-primary" />
              Gym &amp; Fitness Interior Specialists
            </p>
            <h1 className="display-xl mt-6 md:text-[3.6rem] lg:text-[4.4rem]">
              {home.heroHeading}
            </h1>
          </div>

          <div
            className="mx-auto text-center transition-all delay-200 duration-1000 ease-out"
            style={{
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? "none" : "translateY(20px)",
            }}
          >
            <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-background/75 md:text-lg">
              {home.heroDescription}
            </p>
            <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-2">
              <HomeCta
                href={home.ctaLink}
                className="label-caps group relative overflow-hidden bg-primary px-8 py-5 text-primary-foreground transition-all duration-300 active:scale-[0.98]"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-background transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative transition-colors duration-300 group-hover:text-foreground">
                  {home.ctaText}
                </span>
              </HomeCta>
              <Link
                to="/work"
                className="label-caps group inline-flex items-center justify-center gap-3 border border-background/45 bg-foreground/30 px-8 py-5 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-foreground/70 hover:text-primary"
              >
                <Play size={13} className="translate-x-[1px]" />
                View Our Work
              </Link>
            </div>
            <div className="label-caps mt-10 flex flex-col items-center gap-3 border-t border-background/15 pt-6 text-background/55 md:hidden">
              <span>Function first</span>
              <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
              <span>Designed for real use</span>
              <span className="h-px w-8 bg-primary/60" aria-hidden="true" />
              <span>Pan India</span>
            </div>
          </div>
        </div>


        <div className="absolute inset-x-0 bottom-0 hidden border-t border-background/15 text-background/60 md:block">
          <div className="mx-auto grid max-w-[110rem] grid-cols-3 divide-x divide-background/15 px-10">
            <p className="label-caps py-5">Function first</p>
            <p className="label-caps py-5 text-center">Designed for real use</p>
            <p className="label-caps py-5 text-right">Pan India</p>
          </div>
        </div>
      </section>

      {/* 02 — Trusted by */}
      <div className="seam-to-cream" />
      <TrustedBy />

      {/* 03 — Selected Work */}
      <section className="blend-cream-bottom">
        <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-24">
          <Reveal className="flex flex-col items-center text-center">
            <p className="label-caps flex items-center gap-4 text-muted-foreground">
              <span className="hidden h-px w-16 bg-border sm:block" />
              Our gym projects
              <span className="hidden h-px w-16 bg-border sm:block" />
            </p>
            <h2 className="display-statement mt-4">
              Spaces Designed <span className="accent-italic">to perform</span>
            </h2>
            <p className="label-caps mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground">
              <span>People</span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
              <span>Space</span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
              <span>Movement</span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
              <span>Function</span>
              <span className="h-1 w-1 rounded-full bg-primary" aria-hidden="true" />
              <span>Impact</span>
            </p>
          </Reveal>

          {featuredProjects.length > 0 && <ProjectShowcase projects={featuredProjects} />}

          <Reveal className="mt-12 flex flex-wrap items-center justify-end gap-6 border-t border-border pt-6">
            <Link
              to="/work"
              className="label-caps group inline-flex items-center gap-3 transition-colors duration-300 hover:text-primary"
            >
              View all projects
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight size={15} />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {featuredBlogs.length > 0 && (
        <section className="blend-cream-bottom">
          <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-24">
            <Reveal className="flex flex-col items-center text-center">
              <p className="label-caps flex items-center gap-4 text-muted-foreground">
                <span className="hidden h-px w-16 bg-border sm:block" />
                From the journal
                <span className="hidden h-px w-16 bg-border sm:block" />
              </p>
              <h2 className="display-statement mt-4">
                What we&apos;ve <span className="accent-italic">learned</span>
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {featuredBlogs.map((post, i) => (
                <Reveal key={post.slug} delay={i * 80}>
                  <Link
                    to="/resources/blog/$slug"
                    params={{ slug: post.slug }}
                    className="group block"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={post.image}
                        alt={post.title}
                        loading="lazy"
                        width={1400}
                        height={1000}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="label-caps bg-secondary px-3 py-1.5 text-primary">{post.category}</span>
                      <span className="label-caps inline-flex items-center gap-1.5 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-2xl uppercase leading-tight transition-colors duration-300 group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">{post.excerpt}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-12 flex flex-wrap items-center justify-end gap-6 border-t border-border pt-6">
              <Link
                to="/resources"
                className="label-caps group inline-flex items-center gap-3 transition-colors duration-300 hover:text-primary"
              >
                View all articles
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowRight size={15} />
                </span>
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      <Statement
        words={[
          "Function First",
          "Aesthetics With Purpose",
          "Built For Peak Hour",
          "Designed To Perform",
        ]}
        tone="ink"
      />

      {/* 04 — Why Gym Interiors */}
      <WhyGymZones />

      {/* 05 — The Sagrika Method */}
      <SagrikaMethod steps={steps} />

      {/* 06 — About Sagrika */}
      <AboutSagrika
        portrait={founderImg}
        background={caseImg}
        introduction="I’m Sagrika Saraf, an interior designer and founder of Design Diaries. My journey began with an interest in the human experience of spaces and evolved from designing interiors for residential and commercial spaces to a more refined interest in gym and fitness spaces."
        story="My first gym project changed the course of my work. With the increase in projects came the growth in my understanding of movement, equipment, user behavior and what makes a fitness space really work. I now apply that experience to every gym interior design project that I do."
      />

      <div className="seam-to-cream" />

      {/* 07 — Case Study Spotlight */}
      <CaseStudySpotlight
        meta="JAMMU, J&K | 3,500 SQ FT | 2024"
        titleTop="A3 FITNESS"
        titleBottom="GYM & SPA"
        kicker="MAKING 3,500 SQ FT WORK HARDER."
        summary="The room had to fit cardio, Zumba, dumbbells and strength training and still feel open and inviting."
        href="/work"
        images={[
          { src: heroImg, alt: "Film of the finished gym floor in use", video: heroVideo.url },
          { src: caseImg, alt: "Mezzanine cardio deck above the main strength floor" },
          { src: p1, alt: "Strength training zone with racks along the wall" },
          { src: gallery1, alt: "Functional training area with open floor space" },
          { src: materials, alt: "Material and finish detail from the fit-out" },
        ]}
        metrics={[
          { v: "3,500", l: "Sq ft" },
          { v: "4", l: "Training functions" },
          { v: "1", l: "Cohesive flow" },
          { v: "0", l: "Unnecessary partitions" },
        ]}
        note="Ceiling and flooring were used to define the training areas while keeping the space open and connected."
        journeyBackground={p3}
        journey={[
          {
            n: "01",
            t: "The Challenge",
            d: "The space needed to accommodate cardio, Zumba, dumbbells and strength training while still feeling open and inviting for a young, lifestyle-focused audience.",
          },
          {
            n: "02",
            t: "The Thinking",
            d: "We thought of ways that activities and equipment could complement each other, with related functions sharing space but with a clear and seamless flow.",
          },
          {
            n: "03",
            t: "The Decisions",
            d: "We used ceiling and flooring treatments to define different areas, instead of adding partitions. We put cardio and Zumba together because the lighting and music would work well together.",
          },
          {
            n: "04",
            t: "The Outcome",
            d: "The design was so popular that the client eventually moved to a larger space to cope with the overwhelming demand.",
          },
        ]}
      />



      <div className="bg-foreground">
      {/* 08 — Recognition */}
      <Recognition items={recognition} />

      {/* 09 — What clients say */}
      <section className="relative z-[1] -mt-6 bg-foreground text-background">
        <div className="mx-auto max-w-[110rem] px-5 pt-3 pb-16 md:px-10 md:pt-4 md:pb-24">
          <Reveal>
            <div className="label-caps flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-4 text-primary">
                Client testimonials
                <span className="hidden h-px w-24 bg-primary/40 sm:block" />
              </p>
              <p className="hidden text-background/40 md:block">
                People · Space · Movement · Function · Impact
              </p>
            </div>
            <div className="mt-5 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <h2 className="display-statement leading-[0.94]">
                The right people
                <br />
                <span className="accent-italic">Recognise the work</span>
                <span className="heading-rule" aria-hidden="true" />
              </h2>
              <p className="text-sm leading-relaxed text-background/55 lg:justify-self-end lg:text-right">
                Real words from the people behind the gyms we design.
              </p>
            </div>
          </Reveal>

          {featured && (
          <div className={`mt-12 grid gap-px bg-background/12 ${supporting.length ? "lg:grid-cols-[1.15fr_1fr]" : ""}`}>
            {/* Featured quote — quote overlaid on image */}
            <Reveal className="h-full">
              <figure className="group relative flex h-full min-h-[26rem] flex-col justify-end overflow-hidden bg-foreground md:min-h-[32rem]">
                <img
                  src={featured.imageUrl || testimonialFallbackImages[0]}
                  alt={featured.name}
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10" />
                {featured.designation && (
                  <span className="label-caps absolute top-5 left-5 bg-primary px-3 py-2 text-primary-foreground">
                    {featured.designation}
                  </span>
                )}
                <div className="relative z-10 p-7 md:p-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-10 left-6 font-display text-[9rem] leading-none text-primary md:text-[11rem]"
                  >
                    &ldquo;
                  </span>
                  <blockquote className="relative z-10 mt-10 max-w-[34ch] font-display text-[1.5rem] uppercase leading-[1.12] tracking-tight text-background md:text-[2rem]">
                    {featured.testimonial}
                  </blockquote>
                  <figcaption className="relative z-10 mt-8 flex items-center justify-between gap-4 border-t border-background/20 pt-6">
                    <span>
                      <span className="label-caps block text-primary">{featured.name}</span>
                      <span className="mt-1 block text-sm text-background/60">
                        {featured.company}
                      </span>
                    </span>
                    <span className="label-caps text-primary">{"★".repeat(featured.rating)}</span>
                  </figcaption>
                </div>
                <span className="absolute inset-x-0 bottom-0 z-10 h-px w-0 bg-primary transition-[width] duration-700 group-hover:w-full" />
              </figure>
            </Reveal>

            {/* Supporting quotes — photo left, quote right */}
            {supporting.length > 0 && (
            <div className="min-h-0">
            <div
              ref={supportingTrackRef}
              style={supportingMaxHeight ? { maxHeight: supportingMaxHeight } : undefined}
              className="flex flex-col gap-px overflow-y-auto overscroll-auto bg-background/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {supporting.map((t, i) => (
                <Reveal key={t.id} delay={(i + 1) * 130} className="shrink-0">
                  <figure className="group relative grid grid-cols-[6.5rem_minmax(0,1fr)] gap-5 bg-foreground p-5 transition-colors duration-500 hover:bg-background/[0.05] sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6 sm:p-6 md:grid-cols-[9.5rem_minmax(0,1fr)] md:p-7">
                    <div className="relative min-h-[7.5rem] overflow-hidden sm:min-h-[8.5rem] md:min-h-[9.5rem]">
                      <img
                        src={t.imageUrl || testimonialFallbackImages[(i + 1) % testimonialFallbackImages.length]}
                        alt={t.name}
                        loading="lazy"
                        width={300}
                        height={380}
                        className="absolute inset-0 h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-[1.04] group-hover:grayscale-0 motion-reduce:transform-none"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="label-caps flex items-center gap-3 text-primary">
                        <span className="h-px w-6 bg-primary/50" />
                        {t.designation || "Client"}
                      </span>
                      <blockquote className="mt-4 text-sm leading-relaxed text-background/80 md:text-base">
                        {t.testimonial}
                      </blockquote>
                      <figcaption className="mt-4 flex items-end justify-between gap-4 border-t border-background/12 pt-4">
                        <span>
                          <span className="label-caps block text-background">{t.name}</span>
                          <span className="mt-1 block text-xs text-background/50">{t.company}</span>
                        </span>
                      </figcaption>
                    </div>
                    <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-primary transition-[width] duration-500 group-hover:w-full" />
                  </figure>
                </Reveal>
              ))}
            </div>
            </div>
            )}
          </div>
          )}

          {/* Proof rail */}
          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              { n: 15, s: "+", l: "Gym & fitness projects" },
              { display: "Pan India", l: "Designing across India" },
              { n: 6, s: " Stages", l: "From understand to learn" },
            ].map((s, i) => (
              <Reveal
                key={s.l}
                delay={i * 140}
                className="group flex flex-col items-center px-4 py-6 text-center transition-transform duration-500 hover:-translate-y-1 motion-reduce:transform-none"
              >
                <p className="font-display text-4xl leading-none tracking-tight uppercase transition-all duration-500 group-hover:scale-105 group-hover:text-primary md:text-5xl motion-reduce:transform-none">
                  {s.display ?? <CountUp to={s.n ?? 0} suffix={s.s} />}
                </p>
                <span className="mt-4 block h-px w-8 bg-primary/0 transition-all duration-500 group-hover:w-16 group-hover:bg-primary" />
                <p className="label-caps mt-4 text-background/45 transition-colors duration-500 group-hover:text-background/80">
                  {s.l}
                </p>
              </Reveal>
            ))}
          </div>

        </div>



        {/* 10 — Enquiry CTA */}
        <div id="enquire" className="relative overflow-hidden border-t border-background/10">
          <img
            src={gallery1}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-45"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-foreground/95 via-foreground/70 to-foreground/40"
          />
          <div className="relative mx-auto grid max-w-[110rem] gap-14 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="label-caps text-primary">Start a project</p>
              <h2 className="display-xl mt-5">
                Let's plan
                <br />
                <span className="text-primary">your gym</span>
              </h2>
              <p className="mt-7 max-w-md leading-relaxed text-background/65">
                Tell us about your space, equipment, location and how people will use it. We’ll
                transform your needs into a functional, well-designed gym space.
              </p>
            </Reveal>

            <Reveal delay={140} className="bg-background/95 p-6 text-foreground backdrop-blur-sm md:p-10">
              <EnquiryForm />
            </Reveal>
          </div>
        </div>

      </section>
      </div>
    </>
  );
}
