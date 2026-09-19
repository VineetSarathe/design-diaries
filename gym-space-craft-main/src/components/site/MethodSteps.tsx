import { Reveal, useInView } from "./Reveal";
import { cn } from "@/lib/utils";

export function MethodSteps({
  steps,
  label = "The Method",
  title = "Understand → Research → Plan → Design → Build → Learn.",
  intro,
}: {
  steps: { k: string; d: string }[];
  label?: string;
  title?: string;
  intro?: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>(0.2);

  return (
    <section className="bg-secondary">
      <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
        <Reveal>
          <p className="label-caps text-primary">{label}</p>
          <h2 className="display-lg mt-5 max-w-4xl">{title}</h2>
          {intro && <p className="mt-6 max-w-xl text-muted-foreground">{intro}</p>}
        </Reveal>

        <div ref={ref} className="relative mt-16">
          <div className="absolute top-6 right-0 left-0 hidden h-px bg-border lg:block">
            <span
              className="block h-px origin-left bg-primary transition-transform duration-[1600ms] ease-out"
              style={{ transform: `scaleX(${visible ? 1 : 0})` }}
            />
          </div>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
            {steps.map((s, i) => (
              <li
                key={s.k}
                style={{ transitionDelay: `${i * 140}ms` }}
                className={cn(
                  "relative transition-all duration-700 ease-out",
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
                )}
              >
                <span className="label-caps relative z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary bg-background text-primary">
                  0{i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl uppercase">{s.k}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
