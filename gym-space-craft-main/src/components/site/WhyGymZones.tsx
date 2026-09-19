import { useState } from "react";
import { Dumbbell, Wind, Shield, Users, Compass } from "lucide-react";
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
  icon: typeof Dumbbell;
  /** Highlight rectangle over the layout image, in % of the image box. */
  box: { x: number; y: number; w: number; h: number };
};

const zones: Zone[] = [
  {
    n: "01",
    t: "Equipment Logic",
    d: "Every piece of equipment has a purpose and a place.",
    short: "Every piece of equipment has a purpose and a place.",
    img: t1,
    icon: Dumbbell,
    box: { x: 3, y: 5, w: 40, h: 54 },
  },
  {
    n: "02",
    t: "Circulation",
    d: "A good design lets people move through the space in a natural way.",
    short: "A good design lets people move through the space in a natural way.",
    img: t2,
    icon: Wind,
    box: { x: 41, y: 3, w: 9, h: 92 },
  },
  {
    n: "03",
    t: "Durability",
    d: "A gym should look good today and work hard every day.",
    short: "A gym should look good today and work hard every day.",
    img: t3,
    icon: Shield,
    box: { x: 47, y: 7, w: 19, h: 58 },
  },
  {
    n: "04",
    t: "Business Thinking",
    d: "Commercial gym interior design should support the business behind it and the people using the space.",
    short: "Commercial gym interior design should support the business behind it and the people using the space.",
    img: t4,
    icon: Users,
    box: { x: 48, y: 66, w: 47, h: 30 },
  },
];

export function WhyGymZones() {
  const [active, setActive] = useState<number>(0);
  const current = zones[active]!;

  return (
    <section className="bg-foreground text-background">
      <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        {/* Top labels */}
        <div className="flex items-center justify-between gap-6">
          <p className="label-caps flex items-center gap-4 text-primary">
            The Design Approach
            <span className="hidden h-px w-16 bg-primary/40 sm:block" />
          </p>
          <p className="label-caps hidden items-center gap-4 text-background/50 sm:flex">
            Floor Plan
            <span className="h-px w-16 bg-background/25" />
          </p>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.72fr_1.28fr_0.12fr] lg:gap-10">
          {/* Left statement + list */}
          <div className="flex flex-col">
            <h2 className="display-statement leading-[0.95]">
              More than
              <br />
              Just
              <span className="hidden md:inline"> </span>
              <br className="md:hidden" />
              <span className="text-primary">Aesthetics</span>
              <br />
              Alone
            </h2>
            <p className="mt-7 max-w-md leading-relaxed text-background/65">
              Gym interior design is more than simply aesthetics. It’s about how a
              space works, flows and feels to the people who use it.
            </p>

            <ul className="mt-10 flex-1 border-t border-background/15">
              {zones.map((z, i) => {
                const Icon = z.icon;
                const isActive = active === i;
                return (
                  <li key={z.n}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      aria-pressed={isActive}
                      className="group flex w-full items-center gap-5 border-b border-background/15 py-4 text-left transition-colors duration-300"
                    >
                      <Icon
                        aria-hidden
                        className={
                          "h-5 w-5 shrink-0 transition-colors duration-300 " +
                          (isActive ? "text-primary" : "text-background/40")
                        }
                      />
                      <span
                        className={
                          "font-display text-lg uppercase leading-none tracking-tight transition-all duration-300 md:text-xl " +
                          (isActive
                            ? "translate-x-1 text-primary"
                            : "text-background/80 group-hover:translate-x-1 group-hover:text-background")
                        }
                      >
                        {z.t}
                      </span>
                      <span
                        aria-hidden
                        className={
                          "ml-auto h-2 w-2 shrink-0 rounded-full border transition-all duration-300 " +
                          (isActive
                            ? "border-primary bg-primary"
                            : "border-background/35 bg-transparent")
                        }
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="label-caps mt-8 flex items-center gap-4 text-background/50">
              <span className="h-px w-10 bg-primary" />
              Spaces that perform
            </p>
          </div>

          {/* Floor plan with highlight + label */}
          <div className="relative aspect-[4/3] self-center overflow-hidden border border-background/15 bg-black sm:aspect-[16/10] lg:aspect-auto">
            <img
              src={layoutImg}
              alt="Placeholder: overhead gym layout showing strength, circulation, flooring and member zones"
              loading="lazy"
              width={1600}
              height={1200}
              className="h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: 0.9 }}
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
                      ? "0 0 0 9999px rgba(0,0,0,0.35), 0 0 34px 4px color-mix(in oklab, var(--color-primary) 55%, transparent)"
                      : "none",
                }}
              />
            ))}
            {/* Zone label pinned over the highlighted area */}
            <div
              key={current.n}
              className="animate-fade-in pointer-events-none absolute bg-black/85 px-4 py-2.5 backdrop-blur-sm transition-all duration-500"
              style={{
                left: `max(4%, min(${current.box.x}%, 62%))`,
                top: `${Math.min(current.box.y + 6, 78)}%`,
              }}
            >
              <p className="font-display text-sm uppercase tracking-wide text-background">
                {current.t}
              </p>
            </div>
          </div>

          {/* Right rail */}
          <div className="hidden flex-col items-end justify-between lg:flex">
            <p className="label-caps space-y-2 text-right text-background/50">
              <span className="block">People</span>
              <span className="block">Space</span>
              <span className="block">Movement</span>
              <span className="block">Function</span>
              <span className="block text-primary">Impact</span>
            </p>
            <Compass aria-hidden className="h-9 w-9 text-background/40" strokeWidth={1.25} />
          </div>
        </div>

        {/* Bottom tiles */}
        <div className="mt-10 grid gap-px border border-background/15 bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
          {zones.map((z, i) => {
            const isActive = active === i;
            return (
              <button
                type="button"
                key={z.n}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className={
                  "group relative aspect-[16/9] overflow-hidden text-left outline-none transition-shadow duration-300 sm:aspect-[16/11] " +
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
                    (isActive ? "scale-105" : "group-hover:scale-105")
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
                        : "translate-y-1 text-background/0 opacity-0 group-hover:translate-y-0 group-hover:text-background/75 group-hover:opacity-100")
                    }
                  >
                    {z.short}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
