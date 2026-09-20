import { createFileRoute, Link } from "@tanstack/react-router";
import { Instagram } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { CalendarEmbed } from "@/components/site/CalendarEmbed";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/thank-you")({
  head: () =>
    pageSeo({
      title: "Enquiry Received | Design Diaries",
      description:
        "Your gym project enquiry has reached the studio. Book your 30-minute discovery call while you wait for our reply.",
      path: "/thank-you",
      noindex: true,
    }),
  component: ThankYou,
});

function ThankYou() {
  const { instagram } = useContactSettings();

  return (
    <>
      <section className="bg-foreground text-background">
        <div className="mx-auto max-w-[110rem] px-5 pt-28 pb-16 md:px-10 md:pt-36 md:pb-20">
          <Reveal>
            <p className="label-caps text-primary">Enquiry received</p>
            <h1 className="display-lg mt-5 max-w-4xl">Your note is with Sagrika</h1>
            <p className="mt-8 max-w-xl text-lg text-background/80">
              You'll hear back within 24 hours on working days, with an initial view on layout,
              feasibility and timeline. If it's urgent, WhatsApp is the fastest route.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[110rem] gap-12 px-5 py-16 md:px-10 md:py-20 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="label-caps text-primary">Don't wait for the email</p>
            <h2 className="display-lg mt-5">Book the discovery call</h2>
            <p className="mt-6 max-w-md text-muted-foreground">
              Thirty minutes, in your own timezone. Most owners leave the call with a clearer view
              of their capacity than they arrived with.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <CalendarEmbed compact />
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
          <Reveal>
            <p className="label-caps text-primary">While you wait</p>
            <h2 className="display-lg mt-5">Two things worth a look</h2>
          </Reveal>
          <div className="mt-12 grid gap-px bg-border sm:grid-cols-2">
            <Reveal className="bg-background p-8 md:p-10">
              <h3 className="font-display text-2xl uppercase">Selected work</h3>
              <p className="mt-3 text-muted-foreground">
                Fifteen-plus floors, each with the thinking behind it written out.
              </p>
              <Link to="/work" className="label-caps link-underline mt-6 inline-block hover:text-primary">
                View the work
              </Link>
            </Reveal>
            <Reveal delay={100} className="bg-background p-8 md:p-10">
              <h3 className="font-display text-2xl uppercase">On Instagram</h3>
              <p className="mt-3 text-muted-foreground">
                Site walkthroughs, zoning explainers and material calls as they happen.
              </p>
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="label-caps link-underline mt-6 inline-flex items-center gap-2 hover:text-primary"
              >
                <Instagram className="h-4 w-4" /> Follow the studio
              </a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
