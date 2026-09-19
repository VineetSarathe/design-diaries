import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useInView } from "./Reveal";
import { cn } from "@/lib/utils";

type AboutSagrikaProps = {
  portrait: string;
  background: string;
  introduction: string;
  story: string;
};

export function AboutSagrika({
  portrait,
  background,
  introduction,
  story,
}: AboutSagrikaProps) {
  const { ref, visible } = useInView<HTMLElement>(0.18);

  return (
    <section
      ref={ref}
      data-visible={visible}
      aria-labelledby="about-sagrika-title"
      className="group/about relative isolate overflow-hidden bg-foreground text-background lg:min-h-[46rem]"
    >
      <img
        src={background}
        alt=""
        loading="lazy"
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full object-cover opacity-0 grayscale transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          visible && "opacity-30 group-hover/about:scale-[1.015]",
        )}
      />
      <div className="absolute inset-0 bg-foreground/65" />
      <div className="absolute inset-x-0 top-0 h-px bg-background/15" />

      <div className="relative mx-auto grid max-w-[110rem] px-5 py-14 md:px-10 md:py-20 lg:min-h-[46rem] lg:grid-cols-[0.72fr_1.12fr_0.9fr] lg:items-end lg:gap-10 lg:py-0">
        <div
          className={cn(
            "relative z-20 border-l border-background/20 pl-5 opacity-0 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none lg:mb-20",
            visible && "translate-x-0 opacity-100",
            !visible && "-translate-x-3",
          )}
        >
          <div className="mb-16 flex items-center gap-3 lg:mb-32">
            <span className="label-caps text-background/55">06</span>
            <span className="h-px w-10 bg-primary" />
            <span className="label-caps text-background/75">About</span>
          </div>
          <h2 id="about-sagrika-title" className="display-lg max-w-xs text-background">
            <span className="block text-primary">Sagrika</span>
            <span className="block">Saraf</span>
          </h2>
          <p className="label-caps mt-5 text-background/45">Founder · Design Diaries</p>
        </div>

        <div
          className={cn(
            "relative z-10 mt-10 self-end opacity-0 transition-[opacity,transform] delay-100 duration-700 ease-out motion-reduce:transition-none lg:mt-0 lg:h-[42rem]",
            visible && "translate-y-0 opacity-100",
            !visible && "translate-y-5",
          )}
        >
          <div className="absolute inset-x-5 top-5 bottom-0 border border-background/15 lg:inset-x-0 lg:top-12" />
          <img
            src={portrait}
            alt="Sagrika Saraf, founder of Design Diaries, at a gym interior project"
            loading="lazy"
            width={1008}
            height={1264}
            className="relative mx-auto aspect-[4/5] h-auto max-h-[42rem] w-[88%] object-cover object-top grayscale-[20%] transition-[transform,filter] duration-500 ease-out group-hover/about:-translate-y-1 group-hover/about:grayscale-0 motion-reduce:transform-none motion-reduce:transition-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[39rem] lg:w-full"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-foreground to-transparent" />
        </div>

        <div
          className={cn(
            "relative z-20 mt-10 border-t border-background/20 pt-7 opacity-0 transition-[opacity,transform] delay-200 duration-500 ease-out motion-reduce:transition-none lg:mb-20 lg:mt-0",
            visible && "translate-y-0 opacity-100",
            !visible && "translate-y-3",
          )}
        >
          <p className="max-w-md text-base leading-relaxed text-background/85">{introduction}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-background/55">{story}</p>

          <Link
            to="/about"
            className="group/link mt-8 flex w-full items-center justify-between border-b border-background/20 pb-3 text-primary transition-colors duration-300 hover:border-primary hover:text-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="label-caps">Read full story</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1 motion-reduce:transform-none" />
          </Link>
        </div>
      </div>
    </section>
  );
}