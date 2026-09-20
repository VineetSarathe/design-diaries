import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { DeliverablesShowcase } from "@/components/site/DeliverablesShowcase";
import { CtaBanner, Testimonial } from "@/components/site/CtaBanner";
import { FaqSection, ProjectsStrip, ReelsSection } from "@/components/site/Sections";
import { Statement } from "@/components/site/Statement";
import { TrustedBy } from "@/components/site/TrustedBy";
import {
  Chapter,
  DarkBand,
  EditorialSpread,
  OffsetPanel,
} from "@/components/site/PageKit";
import { method, problems, serviceFaqs } from "@/data/services";
import { useProjects } from "@/hooks/use-projects";
import servicesHero from "@/assets/why-materials.jpg";
import gymLayout from "@/assets/gym-layout.jpg";
import floorplan from "@/assets/floorplan.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";
import p1 from "@/assets/project-1.jpg";
import p3 from "@/assets/project-3.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Design Consultancy for Gyms | Design Diaries" },
      {
        name: "description",
        content:
          "One offering, done properly: gym design consultancy covering concept, space planning, lighting, 3D views and 2D working drawings for your contractor to build from.",
      },
      { property: "og:title", content: "Design Consultancy for Gyms | Design Diaries" },
      {
        property: "og:description",
        content: "Concept, space planning, lighting, 3D views and working drawings for gyms.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

const methodImages = [gymLayout, floorplan, caseImg, p3];
const problemImages = [p1, gallery1, floorplan, p6];

function ServicesPage() {
  const { projects } = useProjects();
  const review = projects[1];
  return (
    <>
      <EditorialSpread
        label="Services — Design consultancy"
        title={
          <>
            Design consultancy for gym and fitness spaces.
          </>
        }
        intro="Full service fitness and gym design, including space planning, equipment layout, design development, and technical drawings. All designed around how your space needs to perform."
        primary={servicesHero}
        primaryAlt="Gym interior with micro-cement wall, oak slats and terracotta accent lighting"
        secondary={floorplan}
        secondaryAlt="Dimensioned working drawing of a gym floor"
        caption="Concept to dimensioned drawings — the build stays with your contractor."
        meta={[
          { k: "Scope", v: "Interior design + drawings" },
          { k: "Typical project", v: "1,500–8,000 sq ft" },
          { k: "Process", v: "Six stages" },
          { k: "Handover", v: "Design to your contractor" },
        ]}
      />

      {/* Problems — art-directed panels */}
      <DarkBand>
        <Chapter
          n="01"
          label="Before you call us"
          title={<>WHERE GYM DESIGN OFTEN GOES WRONG</>}
          intro="Most gym projects have at least 2 of these problems. Each is cheaper and easier to fix at the design stage than at handover."
        />
        <div className="mt-12 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <OffsetPanel
              key={p.title}
              n={`0${i + 1}`}
              title={p.title}
              text={p.text}
              image={problemImages[i % problemImages.length] ?? p1}
              imageAlt={`Gym floor condition related to ${p.title}`}
              delay={i * 90}
            />
          ))}
        </div>
      </DarkBand>

      {/* Method — offset sequence */}
      <DarkBand>
        <Chapter n="02" label="The method" title={<>HOW SAGRIKA DESIGNS AROUND THEM</>} />
        <div className="mt-12 space-y-16 md:space-y-24">
          {method.map((m, i) => (
            <Reveal
              key={m.title}
              className={`grid items-center gap-8 md:grid-cols-12 md:gap-12 ${
                i % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div
                className={`group relative overflow-hidden md:col-span-7 ${
                  i % 2 === 1 ? "md:[direction:ltr]" : ""
                }`}
              >
                <img
                  src={methodImages[i % methodImages.length] ?? gymLayout}
                  alt={`Design Diaries method stage — ${m.title}`}
                  loading="lazy"
                  width={1400}
                  height={900}
                  className="aspect-[3/2] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <span className="label-caps absolute top-0 left-0 bg-primary px-4 py-2 text-primary-foreground">
                  Stage 0{i + 1}
                </span>
              </div>
              <div
                className={`md:col-span-5 ${i % 2 === 1 ? "md:[direction:ltr] md:pr-4" : "md:pl-4"}`}
              >
                <span aria-hidden className="block h-0.5 w-14 bg-primary" />
                <h3 className="display-md mt-5">{m.title}</h3>
                <p className="mt-4 leading-relaxed text-background/70">{m.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </DarkBand>

      <Statement words={["Function first", "Drawn to build", "Gym specialists"]} tone="ink" blend="sand" />

      <DeliverablesShowcase fadeFromInk />

      <ProjectsStrip label="Consultancy in practice" title="DESIGN THAT WORKS IN REAL SPACES" limit={3} />

      {review?.testimonial?.quote && (
        <Testimonial
          quote={review.testimonial.quote}
          author={review.testimonial.author}
          role={review.testimonial.role}
          image={review.card || caseImg}
          imageAlt={`${review.name} gym interior`}
        />
      )}

      <TrustedBy compact />

      <CtaBanner
        compact
        image={p5}
        imageAlt="Full-width view of a completed gym training floor"
      />

      <ReelsSection placement="services" />

      <FaqSection items={serviceFaqs} title="Common questions" />
    </>
  );
}
