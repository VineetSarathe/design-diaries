import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

type JourneyItem = {
  year: string;
  title: string;
  text: string;
  image: string;
};

export function AboutJourney({ items }: { items: JourneyItem[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;
  const selected = items[active] ?? items[0];
  if (!selected) return null;

  const move = (direction: number) => {
    setActive((current) => (current + direction + items.length) % items.length);
  };

  return (
    <section className="overflow-hidden bg-secondary" aria-labelledby="journey-heading">
      <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-24">
        <Reveal className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="label-caps text-primary">The journey</p>
            <h2 id="journey-heading" className="display-lg mt-4">
              Built through <span className="accent-italic">curiosity</span>
            </h2>
          </div>
          <p className="max-w-2xl text-muted-foreground lg:justify-self-end">
            What began with curiosity became a specialist practice shaped by how people move, experience and use space.
          </p>
        </Reveal>

        <div
          className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <Reveal className="relative min-h-[30rem] overflow-hidden bg-foreground lg:min-h-[42rem]">
            {items.map((item, index) => (
              <img
                key={`${item.year}-${item.image}`}
                src={item.image}
                alt={item.title}
                loading={index === 0 ? "eager" : "lazy"}
                width={1200}
                height={1500}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover transition-all duration-[1100ms] ease-out",
                  active === index ? "scale-100 opacity-85" : "scale-[1.045] opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-background md:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="label-caps text-primary">Chapter {String(active + 1).padStart(2, "0")}</p>
                  <p className="mt-3 font-serif text-2xl leading-tight md:text-3xl">{selected.year}</p>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => move(-1)} aria-label="Previous story chapter" className="rounded-full border-background/35 bg-foreground/25 text-background hover:border-primary hover:bg-primary hover:text-primary-foreground">
                    <ArrowLeft />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={() => move(1)} aria-label="Next story chapter" className="rounded-full border-background/35 bg-foreground/25 text-background hover:border-primary hover:bg-primary hover:text-primary-foreground">
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <ol className="grid border-x border-t border-border bg-background sm:grid-cols-2">
            {items.map((item, index) => {
              const isActive = active === index;
              return (
                <li key={`${item.year}-${item.title}`} className={cn("border-b border-border", index % 2 === 0 && "sm:border-r")}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActive(index)}
                    className={cn(
                      "group h-full min-h-44 w-full items-start justify-start whitespace-normal rounded-none p-5 text-left transition-all duration-500 md:min-h-52 md:p-7",
                      isActive ? "bg-foreground text-background" : "bg-background text-foreground hover:bg-secondary",
                    )}
                    aria-pressed={isActive}
                  >
                    <span className="flex h-full w-full flex-col">
                      <div className="flex w-full items-start gap-3">
                        <span className="shrink-0 font-display text-xs text-primary tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "label-caps min-w-0 flex-1 leading-snug tracking-[0.12em] sm:tracking-[0.2em] [word-break:break-word]",
                            isActive ? "text-background/50" : "text-muted-foreground",
                          )}
                        >
                          {item.year}
                        </span>
                      </div>
                      <span className="mt-5 block text-sm font-semibold uppercase leading-tight">{item.title}</span>
                      <span className={cn("mt-3 block text-sm font-normal leading-relaxed", isActive ? "text-background/65" : "text-muted-foreground")}>{item.text}</span>
                      <span className="mt-auto block pt-5">
                        <span className={cn("block h-0.5 origin-left bg-primary transition-transform duration-[4200ms] ease-linear", isActive ? "scale-x-100" : "scale-x-0")} />
                      </span>
                    </span>
                  </Button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}