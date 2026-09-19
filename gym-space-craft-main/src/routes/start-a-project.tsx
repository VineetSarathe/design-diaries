import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { ProjectEnquiryForm } from "@/components/site/ProjectEnquiryForm";
import { CalendarEmbed } from "@/components/site/CalendarEmbed";
import { FaqSection } from "@/components/site/Sections";
import { Statement } from "@/components/site/Statement";
import {
  DarkBand,
  SectionHead,
  Seam,
  VisualBand,
} from "@/components/site/PageKit";
import { startFaqs } from "@/data/company";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { useProjects } from "@/hooks/use-projects";
import { whatsappHref } from "@/lib/contact";
import heroImg from "@/assets/hero-gym.jpg";
import gymLayout from "@/assets/gym-layout.jpg";
import floorplan from "@/assets/floorplan.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";

export const Route = createFileRoute("/start-a-project")({
  head: () => ({
    meta: [
      { title: "Start a Gym Project | Design Diaries" },
      {
        name: "description",
        content:
          "Tell us about your gym or fitness studio — size, city, timeline — or book a 30-minute discovery call. Sagrika reviews every enquiry personally.",
      },
      { property: "og:title", content: "Let's Plan Your Gym | Design Diaries" },
      {
        property: "og:description",
        content: "Send your space details or book a 30-minute discovery call.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StartProject,
});

const steps = [
  { k: "01", t: "You send the space", d: "Area, city, what you plan to run in it and roughly when." },
  { k: "02", t: "Sagrika reads it", d: "Every enquiry is read personally — no sales team, no funnel." },
  { k: "03", t: "A considered reply", d: "Within 24 hours, with a first view on layout and feasibility." },
  { k: "04", t: "A 30-minute call", d: "A conversation to understand your space, requirements and the direction of your project." },
];

function StartProject() {
  const contact = useContactSettings();
  const { projects } = useProjects();
  const proof = projects.slice(0, 2);
  const reviewProject = proof[0];
  const review = reviewProject?.testimonial;

  return (
    <>
      <section className="relative overflow-hidden bg-foreground pt-20 text-background">
        <img
          src={heroImg}
          alt="Strength training floor designed by Design Diaries"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <span className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/55" />
        <div className="relative mx-auto grid max-w-[110rem] gap-12 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <p className="label-caps text-primary">Start a Project</p>
            <h1 className="display-lg mt-5">Tell us about your space</h1>
            <p className="mt-6 max-w-md text-background/75">
              Planning a gym, fitness studio or wellness space? Tell us about your project, your
              requirements and what you want the space to achieve.
            </p>
            <div className="mt-8 hidden grid-cols-2 gap-px bg-background/20 lg:grid">
              {[
                ["Reply within", "24 hours"],
                ["Read by", "Sagrika"],
                ["Approach", "Function first"],
                ["Coverage", "Pan India"],
              ].map(([k, v]) => (
                <div key={k} className="bg-foreground/75 p-4 backdrop-blur-sm">
                  <p className="label-caps text-background/50">{k}</p>
                  <p className="mt-2 font-display uppercase">{v}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="bg-background p-5 text-foreground shadow-2xl md:p-8">
            <ProjectEnquiryForm />
          </Reveal>
        </div>
      </section>

      <DarkBand>
        <SectionHead
          label="How it works"
          title={<>Four steps from enquiry to floor plan</>}
          intro="No forms lost in an inbox The first reply already contains a view on your space"
        />
        <div className="mt-12 grid gap-px bg-background/15 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.k} delay={i * 90} className="group bg-foreground p-8 transition-colors duration-500 hover:bg-background/[0.06]">
              <p className="label-caps text-primary">{s.k}</p>
              <h3 className="mt-4 font-display text-lg uppercase leading-tight">{s.t}</h3>
              <p className="mt-3 text-background/70">{s.d}</p>
              <span aria-hidden className="mt-6 block h-px w-8 bg-primary transition-all duration-700 group-hover:w-20" />
            </Reveal>
          ))}
        </div>
        <div className="mt-14">
          <VisualBand columns={4} items={[
            { src: gymLayout, alt: "Gym layout study", caption: "We start with the shell" },
            { src: floorplan, alt: "Zoning drawing", caption: "Then the zoning" },
            { src: gallery1, alt: "Equipment placement detail", caption: "Then the equipment" },
            { src: caseImg, alt: "Finished training floor", caption: "Then it gets built" },
          ]} />
        </div>
      </DarkBand>

      <Seam to="cream" />

      <section className="blend-cream-top">
        <div className="mx-auto grid max-w-[110rem] gap-10 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="label-caps text-primary">Before you send</p>
            <h2 className="display-lg mt-4">A real reply from the designer</h2>
            <p className="mt-5 max-w-md text-muted-foreground">Sagrika reads every enquiry herself No sales team and no automated funnel</p>
          </Reveal>
          <Reveal delay={140} className="space-y-8">
            <div className="border border-border bg-card p-6 md:p-8">
              <div className="mt-8 grid grid-cols-2 gap-3">
                {proof.map((p) => (
                  <Link
                    key={p.slug}
                    to="/work/$slug"
                    params={{ slug: p.slug }}
                    className="group block"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-muted">
                      <img
                        src={p.card}
                        alt={`${p.name}, ${p.location}`}
                        loading="lazy"
                        width={800}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                      />
                    </div>
                    <p className="label-caps mt-3 transition-colors duration-300 group-hover:text-primary">
                      {p.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {[p.location, p.area].filter(Boolean).join(" · ")}
                    </p>
                  </Link>
                ))}
              </div>
              {review?.quote && (
                <blockquote className="mt-8 border-l-2 border-primary py-1 pl-6 text-sm text-muted-foreground">
                  “{review.quote}”
                  <span className="label-caps mt-3 block">
                    {review.author}, {review.role}
                    {reviewProject.location ? ` — ${reviewProject.location}` : ""}
                  </span>
                </blockquote>
              )}
            </div>

            <a
              href={whatsappHref(contact.whatsapp)}
              target="_blank"
              rel="noreferrer noopener"
              className="label-caps flex items-center justify-between gap-4 border border-input px-6 py-5 transition-all duration-300 hover:border-primary hover:text-primary active:scale-[0.99]"
            >
              <span className="inline-flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" /> Prefer WhatsApp? Message the
                studio
              </span>
              <span aria-hidden>→</span>
            </a>
          </Reveal>
        </div>
      </section>

      <Statement words={["Send the space", "Get a real reply", "Start a project"]} tone="ink" />

      {/* Booking — dark */}
      <DarkBand id="calendar" className="scroll-mt-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHead
            label="Or skip the form"
            title={<>Book the call directly</>}
            intro="A 30-minute focused conversation about your space, requirements and project goals."
          />
          <Reveal delay={120}>
            <CalendarEmbed />
          </Reveal>
        </div>
      </DarkBand>

      <Seam to="cream" />

      <FaqSection items={startFaqs} title="Before you get in touch" />
    </>
  );
}
