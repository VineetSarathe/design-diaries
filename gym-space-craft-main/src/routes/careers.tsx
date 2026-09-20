import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { CtaBanner } from "@/components/site/CtaBanner";
import { roles } from "@/data/company";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { mailtoHref } from "@/lib/contact";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers at Design Diaries | Gym Interior Design Studio" },
      {
        name: "description",
        content:
          "Work on fitness interiors where layout, circulation and durability matter as much as finish. Open roles and applications at Design Diaries, Indore.",
      },
      { property: "og:title", content: "Careers | Design Diaries" },
      {
        property: "og:description",
        content: "Join a studio that specialises in gym and fitness interiors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const contact = useContactSettings();

  return (
    <>
      <section className="mx-auto max-w-[110rem] px-5 pt-28 pb-16 md:px-10 md:pt-36 md:pb-20">
        <Reveal>
          <p className="label-caps text-primary">Careers</p>
          <h1 className="display-lg mt-5 max-w-4xl">GROW THROUGH REAL WORK</h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground">
            Join a studio where design is more than just esthetics. Work on real wellness and gym
            interior design projects and get experience of helping to create spaces that work for the
            people who use them.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[110rem] gap-10 px-5 py-16 md:grid-cols-2 md:px-10 md:py-20">
          <Reveal>
            <p className="label-caps text-primary">Open roles</p>
            {roles.length > 0 ? (
              <ul className="mt-6">
                {roles.map((r) => (
                  <li key={r.title} className="border-t border-border py-6">
                    <h2 className="font-display text-2xl uppercase">{r.title}</h2>
                    <p className="label-caps mt-2 text-muted-foreground">
                      {r.type} · {r.location}
                    </p>
                    <p className="mt-3 text-muted-foreground">{r.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 max-w-md text-muted-foreground">
                Currently there are no formal openings. We are always open to meeting designers,
                architects and project managers who are curious, detail-oriented and interested in
                commercial or fitness spaces.
              </p>
            )}
          </Reveal>

          <Reveal delay={120}>
            <p className="label-caps text-primary">How to apply</p>
            <h2 className="mt-5 font-display text-2xl uppercase">One email, no forms</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              Send your portfolio and a short note to the studio. Tell us which project on this site
              you'd have done differently, and why — that's the part we read first.
            </p>
            <a
              href={mailtoHref(contact.email, "Portfolio — Design Diaries")}
              className="label-caps mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98]"
            >
              {contact.email}
            </a>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        label="Not looking for a job?"
        title="Tell us about your gym instead"
        cta="Start a Project"
      />
    </>
  );
}
