import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function CtaBanner({
  label = "Start a Project",
  title = "SEE THE SPACE BEFORE IT IS BUILT",
  body = "Thinking gym, fitness studio, or wellness project? Let’s talk about your space, your needs, and what you want to build.",
  cta = "Start a Project",
  image,
  imageAlt = "Purpose-designed strength and conditioning gym interior",
  compact = false,
}: {
  label?: string;
  title?: string;
  body?: string;
  cta?: string;
  image?: string;
  imageAlt?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={cn(
        "group relative isolate overflow-hidden bg-foreground text-background",
        !compact && "min-h-[32rem] md:min-h-[40rem]",
      )}
    >
      {image ? (
        <>
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            width={1920}
            height={1080}
            className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[1400ms] ease-out motion-safe:group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/25" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-foreground/70 to-transparent" />
        </>
      ) : null}
      <div
        className={cn(
          "mx-auto flex max-w-[110rem] px-5 md:px-10",
          compact
            ? "min-h-[22rem] items-end py-14 md:min-h-[26rem] md:py-16"
            : "min-h-[32rem] items-end py-14 md:min-h-[40rem] md:py-20",
        )}
      >
        <Reveal className="w-full border-t border-background/30 pt-8 md:grid md:grid-cols-[1fr_auto] md:items-end md:gap-16 md:pt-10">
          <div className="max-w-3xl">
            <p className="label-caps text-primary">{label}</p>
            <h2 className="display-xl mt-5 max-w-2xl">{title}</h2>
            <p className="mt-6 max-w-xl text-background/80">{body}</p>
          </div>
          <Link
            to="/start-a-project"
            className="label-caps mt-8 inline-flex min-h-12 shrink-0 items-center bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:bg-background hover:text-foreground active:scale-[0.98] md:mt-0"
          >
            {cta}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Testimonial({
  quote,
  author,
  role,
  image,
  imageAlt = "Finished gym interior designed for performance",
}: {
  quote: string;
  author: string;
  role: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="h-fit bg-foreground text-background">
      <div
        className={cn(
          "mx-auto flex max-w-[110rem] flex-col",
          image && "lg:flex-row lg:items-stretch",
        )}
      >
        {image ? (
          <div className="relative aspect-[3/2] w-full min-h-0 shrink-0 overflow-hidden lg:aspect-auto lg:w-[40%]">
            <img
              src={image}
              alt={imageAlt}
              loading="lazy"
              width={1400}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/65 via-transparent to-transparent" />
            <p className="label-caps absolute bottom-6 left-5 text-background/75 md:bottom-8 md:left-8">
              Built from the drawings
            </p>
          </div>
        ) : null}
        <Reveal className="flex min-h-0 min-w-0 flex-1 flex-col px-5 pb-5 pt-8 md:px-10 md:pb-6 md:pt-10">
          <div className="flex items-center justify-between border-t border-background/20 pt-5">
            <p className="label-caps text-primary">Client Words</p>
            <span className="font-serif text-6xl leading-none text-primary/70" aria-hidden>
              “
            </span>
          </div>
          <blockquote className="mt-8 mb-8 max-w-3xl font-display text-2xl leading-[1.08] uppercase md:mt-10 md:mb-8 md:text-4xl">
            {quote}
          </blockquote>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-background/20 pt-5">
            <div>
              <p className="label-caps text-background">{author}</p>
              <p className="mt-2 text-sm text-background/55">{role}</p>
            </div>
            <span className="label-caps text-primary">Design that builds cleanly</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
