import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function PageIntro({
  label,
  title,
  intro,
  children,
}: {
  label: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-[110rem] px-5 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32">
      <Reveal>
        <p className="label-caps text-primary">{label}</p>
        <h1 className="display-lg mt-5 max-w-4xl">{title}</h1>
        <p className="mt-8 max-w-2xl text-lg text-muted-foreground">{intro}</p>
      </Reveal>
      {children}
      <Reveal className="mt-16 border-t border-border pt-10">
        <p className="text-sm text-muted-foreground">
          This page is next in the build — the homepage is the finished reference for tone, layout
          and interaction.
        </p>
        <Link
          to="/start-a-project"
          className="label-caps mt-6 inline-block bg-primary px-7 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98]"
        >
          Start a Project
        </Link>
      </Reveal>
    </section>
  );
}
