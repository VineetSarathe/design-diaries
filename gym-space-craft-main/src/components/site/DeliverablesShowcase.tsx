import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { deliverables } from "@/data/services";
import conceptImage from "@/assets/case-study.jpg";
import planningImage from "@/assets/gym-layout.jpg";
import lightingImage from "@/assets/project-5.jpg";
import drawingsImage from "@/assets/floorplan.jpg";
import viewsImage from "@/assets/project-3.jpg";

const images = [conceptImage, planningImage, lightingImage, drawingsImage, viewsImage];

export function DeliverablesShowcase({ fadeFromInk = false }: { fadeFromInk?: boolean }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % deliverables.length),
      1600,
    );
    return () => window.clearInterval(timer);
  }, [paused]);

  const selected = deliverables[active] ?? deliverables[0];
  const selectedImage = images[active] ?? images[0];
  if (!selected || !selectedImage) return null;

  const SelectedIcon = selected.icon;

  return (
    <section className={cn("bg-secondary", fadeFromInk && "-mt-px")}>
      {fadeFromInk ? <div aria-hidden className="seam-ink-to-sand" /> : null}
      <div
        className={cn(
          "mx-auto max-w-[110rem] px-5 md:px-10",
          fadeFromInk ? "pt-10 pb-20 md:pt-14 md:pb-28" : "py-20 md:py-28",
        )}
      >
        <Reveal className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:items-end">
          <div>
            <p className="label-caps text-primary">Deliverables</p>
            <h2 className="display-lg mt-5">What you receive</h2>
          </div>
          <p className="max-w-xl text-muted-foreground lg:justify-self-end">
            Our design package is an organized plan that moves your gym from spatial planning to detailed working drawings.
          </p>
        </Reveal>

        <div className="mt-12 grid overflow-hidden border border-border bg-background lg:grid-cols-[0.72fr_1.28fr] lg:items-stretch">
          <div className="flex min-h-0 flex-col border-b border-border lg:h-full lg:border-r lg:border-b-0">
            {deliverables.map((item, index) => {
              const Icon = item.icon;
              const isActive = active === index;
              return (
                <Button
                  key={item.title}
                  type="button"
                  variant="ghost"
                  onClick={() => setActive(index)}
                  onMouseEnter={() => {
                    setPaused(true);
                    setActive(index);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  aria-pressed={isActive}
                  className="group relative h-full min-h-[3.25rem] w-full min-w-0 flex-1 justify-start whitespace-normal rounded-none border-b border-border px-5 py-3 text-left last:border-b-0 hover:bg-secondary md:px-6 md:py-3.5"
                >
                  <span
                    aria-hidden
                    className={`absolute inset-y-0 left-0 w-1 origin-top bg-primary transition-transform duration-500 ${isActive ? "scale-y-100" : "scale-y-0"}`}
                  />
                  <span className={`w-10 shrink-0 font-display text-xs transition-colors ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                    {item.n}
                  </span>
                  <Icon className={`mr-4 h-5 w-5 shrink-0 transition-all duration-500 ${isActive ? "scale-110 text-primary" : "text-muted-foreground"}`} />
                  <span className={`min-w-0 font-display text-sm uppercase leading-snug transition-colors md:text-base ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {item.title}
                  </span>
                </Button>
              );
            })}
          </div>

          <div
            className="relative min-h-[20rem] overflow-hidden bg-foreground text-background sm:min-h-[22rem] lg:min-h-[26rem]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {images.map((image, index) => (
              <img
                key={image}
                src={image}
                alt={deliverables[index] ? `${deliverables[index].title} for a gym interior` : "Gym design deliverable"}
                loading={index === 0 ? "eager" : "lazy"}
                width={1400}
                height={1050}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1000ms] ease-out ${active === index ? "scale-100 opacity-70" : "scale-[1.05] opacity-0"}`}
              />
            ))}
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/35 to-transparent" />

            <div key={selected.title} className="animate-fade-in absolute inset-x-0 bottom-0 p-5 md:p-7">
              <div className="flex items-center gap-3">
                <SelectedIcon className="h-5 w-5 text-primary" />
                <p className="label-caps text-primary">Included in your package</p>
              </div>
              <h3 className="display-md mt-3 max-w-2xl text-background">{selected.title}</h3>
              <p className="mt-2.5 max-w-2xl text-sm leading-relaxed text-background/75 md:text-[0.9375rem]">{selected.text}</p>
              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {selected.includes.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-background/82">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-primary/60">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex gap-2" aria-hidden>
                {deliverables.map((item, index) => (
                  <span key={item.n} className={`h-0.5 transition-all duration-500 ${active === index ? "w-12 bg-primary" : "w-5 bg-background/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}