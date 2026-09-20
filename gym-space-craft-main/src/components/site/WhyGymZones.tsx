import { useEffect, useState } from "react";
import layoutImg from "@/assets/gym-layout.jpg";
import t1 from "@/assets/project-1.jpg";
import t2 from "@/assets/project-3.jpg";
import t3 from "@/assets/why-materials.jpg";
import t4 from "@/assets/case-study.jpg";

type Zone = {
  n: string;
  t: string;
  d: string;
  short: string;
  img: string;
  /** Highlight rectangle over the layout image, in % of the image box. */
  box: { x: number; y: number; w: number; h: number };
};

const zones: Zone[] = [
  {
    n: "01",
    t: "Equipment Logic",
    d: "Every piece of equipment has a purpose and a place. We plan the floor so each station works without crowding the next.",
    short: "Every piece of equipment has a purpose and a place.",
    img: t1,
    box: { x: 3, y: 5, w: 40, h: 54 },
  },
  {
    n: "02",
    t: "Circulation",
    d: "A good design lets people move through the space in a natural way. Paths stay clear even when the gym is at its busiest.",
    short: "A good design lets people move through the space in a natural way.",
    img: t2,
    box: { x: 41, y: 3, w: 9, h: 92 },
  },
  {
    n: "03",
    t: "Durability",
    d: "A gym should look good today and work hard every day. We design with materials, finishes and layouts that last.",
    short: "A gym should look good today and work hard every day.",
    img: t3,
    box: { x: 49.2, y: 5.8, w: 16.8, h: 54 },
  },
  {
    n: "04",
    t: "Business Thinking",
    d: "Commercial gym interior design should support the business behind it and the people using the space.",
    short: "Commercial gym interior design should support the business behind it and the people using the space.",
    img: t4,
    box: { x: 48, y: 66, w: 47, h: 30 },
  },
];

export function WhyGymZones() {
  const [active, setActive] = useState<number>(0);
  const current = zones[active]!;

  useEffect(() => {
    const timer = window.setInterval(
      () => setActive((index) => (index + 1) % zones.length),
      3000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <p className="label-caps flex items-center gap-4 text-primary">
          The Design Approach
          <span className="hidden h-px w-16 bg-primary/40 sm:block" />
        </p>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
          <div>
            <h2 className="display-statement leading-[0.95]">
              Functional gym design,
              <br />
              <span className="text-primary">beyond aesthetics</span>
            </h2>
            <p className="mt-7 max-w-xl leading-relaxed text-background/65">
              From equipment zoning and circulation to lighting, flooring and material selection, every detail is designed around how people move, train and experience the space.
            </p>

            <ul className="mt-12">
              {zones.map((z, i) => {
                const isActive = active === i;
                return (
                  <li key={z.n}>
                    <div
                      aria-current={isActive ? "true" : undefined}
                      className="w-full py-4"
                    >
                      <span className="flex items-center gap-4 md:gap-5">
                        <span
                          className={
                            "w-7 shrink-0 font-mono text-[0.7rem] tracking-[0.18em] transition-colors duration-300 " +
                            (isActive ? "text-primary" : "text-background/40")
                          }
                        >
                          {z.n}
                        </span>
                        <span
                          className={
                            "shrink-0 font-display text-[0.95rem] uppercase tracking-[0.14em] transition-colors duration-300 md:text-base " +
                            (isActive ? "text-primary" : "text-background/80")
                          }
                        >
                          {z.t}
                        </span>
                        <span
                          aria-hidden
                          className={
                            "h-px min-w-6 flex-1 transition-colors duration-300 " +
                            (isActive ? "bg-primary/45" : "bg-background/20")
                          }
                        />
                        <span
                          aria-hidden
                          className={
                            "h-2 w-2 shrink-0 rounded-full border transition-all duration-300 " +
                            (isActive
                              ? "border-primary bg-primary"
                              : "border-background/40 bg-transparent")
                          }
                        />
                      </span>
                      <span
                        className={
                          "grid transition-[grid-template-rows] duration-300 ease-out " +
                          (isActive ? "grid-rows-[1fr]" : "grid-rows-[0fr]")
                        }
                      >
                        <span className="overflow-hidden">
                          <span className="block pl-11 pt-3 text-sm leading-relaxed text-background/55 md:pl-12 md:text-[0.9375rem]">
                            {z.d}
                          </span>
                        </span>
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden border border-background/15 bg-black sm:aspect-[16/10] lg:aspect-[16/11]">
            <img
              src={layoutImg}
              alt="Overhead gym layout showing strength, circulation, flooring and member zones"
              loading="lazy"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
              style={{ opacity: 0.92 }}
            />
            {zones.map((z, i) => (
              <div
                key={z.n}
                aria-hidden
                className="pointer-events-none absolute rounded-sm transition-all duration-500 ease-out"
                style={{
                  left: `${z.box.x}%`,
                  top: `${z.box.y}%`,
                  width: `${z.box.w}%`,
                  height: `${z.box.h}%`,
                  opacity: active === i ? 1 : 0,
                  border: "2px solid var(--color-primary)",
                  boxShadow:
                    active === i
                      ? "0 0 0 9999px rgba(0,0,0,0.38), 0 0 34px 4px color-mix(in oklab, var(--color-primary) 55%, transparent)"
                      : "none",
                }}
              />
            ))}
            <div
              key={current.n}
              className="animate-fade-in pointer-events-none absolute -translate-y-1"
              style={{
                left: `max(3%, min(${current.box.x + 1.6}%, 64%))`,
                top: `${Math.min(current.box.y + 5, 78)}%`,
              }}
            >
              <p
                className="font-display text-xs uppercase tracking-[0.2em] text-background"
                style={{
                  textShadow:
                    "0 1px 0 rgba(0,0,0,0.45), 0 10px 18px rgba(0,0,0,0.55)",
                }}
              >
                {current.t}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-px border border-background/15 bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map((z, i) => {
            const isActive = active === i;
            return (
              <div
                key={z.n}
                className={
                  "relative aspect-[16/9] overflow-hidden sm:aspect-[16/11] " +
                  (isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-foreground" : "")
                }
              >
                <img
                  src={z.img}
                  alt={`Placeholder: ${z.t}`}
                  loading="lazy"
                  width={1200}
                  height={825}
                  className={
                    "absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out " +
                    (isActive ? "scale-105" : "")
                  }
                />
                <div
                  className={
                    "absolute inset-0 transition-colors duration-500 " +
                    (isActive
                      ? "bg-gradient-to-t from-black/90 via-black/45 to-black/20"
                      : "bg-gradient-to-t from-black/85 to-black/15")
                  }
                />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="font-display text-lg uppercase leading-none text-background sm:text-xl md:text-2xl">
                    {z.t}
                  </h3>
                  <p
                    className={
                      "mt-2.5 max-w-[16rem] text-sm leading-snug transition-all duration-500 " +
                      (isActive
                        ? "translate-y-0 text-background/85 opacity-100"
                        : "translate-y-1 text-background/0 opacity-0")
                    }
                  >
                    {z.short}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
