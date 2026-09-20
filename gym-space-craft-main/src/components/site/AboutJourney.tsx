import { useEffect, useRef, useState, type TouchEvent } from "react";
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
  const swipeStart = useRef<number | null>(null);

  useEffect(() => {
    if (paused || items.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;
  const selected = items[active] ?? items[0];
  if (!selected) return null;

  const move = (direction: number) => {
    setActive((current) => (current + direction + items.length) % items.length);
  };

  const onTouchStart = (event: TouchEvent) => {
    swipeStart.current = event.changedTouches[0]?.clientX ?? null;
    setPaused(true);
  };

  const onTouchEnd = (event: TouchEvent) => {
    const start = swipeStart.current;
    const end = event.changedTouches[0]?.clientX;
    swipeStart.current = null;
    setPaused(false);
    if (start == null || end == null) return;
    const delta = start - end;
    if (Math.abs(delta) < 40) return;
    move(delta > 0 ? 1 : -1);
  };

  return (
    <section className="overflow-hidden bg-secondary" aria-labelledby="journey-heading">
      <div className="mx-auto max-w-[110rem] px-5 py-16 md:px-10 md:py-24">
        <Reveal className="grid gap-6 border-b border-border pb-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="label-caps flex items-center gap-4 text-primary">
              The journey
              <span className="h-px w-16 bg-primary/40 lg:hidden" />
            </p>
            <h2 id="journey-heading" className="display-lg mt-4">
              Built through <span className="accent-italic">curiosity</span>
            </h2>
          </div>
          <p className="max-w-2xl text-muted-foreground lg:justify-self-end">
            What began with curiosity became a specialist practice shaped by how people move, experience and use space.
          </p>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal className="relative aspect-[4/5] overflow-hidden bg-foreground sm:aspect-[3/4] lg:aspect-auto lg:min-h-[42rem]">
            {items.map((item, index) => (
              <img
                key={`${item.year}-${item.image}`}
                src={item.image}
                alt={item.title}
                loading={index === 0 ? "eager" : "lazy"}
                width={1200}
                height={1500}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ease-out",
                  active === index ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <span className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-background md:p-8">
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="label-caps text-primary">Chapter {String(active + 1).padStart(2, "0")}</p>
                  <p className="mt-2 font-serif text-3xl leading-tight md:text-3xl">{selected.year}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => move(-1)}
                    aria-label="Previous story chapter"
                    className="rounded-full border-background/35 bg-foreground/25 text-background hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowLeft />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => move(1)}
                    aria-label="Next story chapter"
                    className="rounded-full border-background/35 bg-foreground/25 text-background hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="lg:hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <ol className="grid grid-cols-5 gap-1 border-t border-border pt-5">
              {items.map((item, index) => {
                const isActive = active === index;
                return (
                  <li key={`${item.year}-step`}>
                    <button
                      type="button"
                      onClick={() => setActive(index)}
                      className="flex w-full flex-col items-center gap-2 text-center"
                      aria-pressed={isActive}
                    >
                      <span className={cn("font-display text-[0.65rem] tabular-nums", isActive ? "text-primary" : "text-muted-foreground")}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full border",
                          isActive ? "border-primary bg-primary" : "border-border bg-transparent",
                        )}
                      />
                      <span className={cn("label-caps max-w-[4.6rem] text-center text-[0.58rem] leading-[1.2] tracking-[0.08em] [text-wrap:balance]", isActive ? "text-foreground" : "text-muted-foreground")}>
                        {item.year}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 border-t border-border pt-5">
              <div className="flex items-start justify-between gap-4">
                <p className="label-caps text-primary">
                  {String(active + 1).padStart(2, "0")}{" "}
                  <span className="text-foreground">{selected.title}</span>
                </p>
                <p className="label-caps shrink-0 text-muted-foreground">Swipe →</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.text}</p>
            </div>
          </div>

          <ol className="hidden border-x border-t border-border bg-background sm:grid-cols-2 lg:grid">
            {items.map((item, index) => {
              const isActive = active === index;
              return (
                <li key={`${item.year}-${item.title}`} className={cn("border-b border-border", index % 2 === 0 && "lg:border-r")}>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setActive(index)}
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                    className={cn(
                      "h-full min-h-44 w-full items-start justify-start whitespace-normal rounded-none p-5 text-left transition-all duration-500 md:min-h-52 md:p-7",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        : "bg-background text-foreground hover:bg-background hover:text-foreground",
                    )}
                    aria-pressed={isActive}
                  >
                    <span className="flex h-full w-full flex-col">
                      <div className="flex w-full items-start gap-3">
                        <span
                          className={cn(
                            "shrink-0 font-display text-xs tabular-nums",
                            isActive ? "text-primary-foreground" : "text-primary",
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={cn(
                            "label-caps min-w-0 flex-1 leading-snug tracking-[0.12em] transition-colors duration-300 sm:tracking-[0.2em] [word-break:break-word]",
                            isActive ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {item.year}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "mt-5 block text-sm font-semibold uppercase leading-tight transition-colors duration-300",
                          isActive ? "text-primary-foreground" : "text-foreground",
                        )}
                      >
                        {item.title}
                      </span>
                      <span
                        className={cn(
                          "mt-3 block text-sm font-normal leading-relaxed transition-colors duration-300",
                          isActive ? "text-primary-foreground/80" : "text-muted-foreground",
                        )}
                      >
                        {item.text}
                      </span>
                      <span className="mt-auto block pt-5">
                        <span
                          className={cn(
                            "block h-0.5 origin-left transition-transform duration-1000 ease-linear",
                            isActive ? "scale-x-100 bg-primary-foreground" : "scale-x-0 bg-primary",
                          )}
                        />
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
