import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { mailtoHref, telHref, whatsappHref } from "@/lib/contact";
import { loadRouteSeo, routePageSeo } from "@/lib/page-seo";
import contactHero from "@/assets/hero-gym.jpg";

export const Route = createFileRoute("/contact")({
  loader: () => loadRouteSeo("/contact"),
  head: ({ loaderData }) => routePageSeo("/contact", undefined, loaderData),
  component: ContactPage,
});

function ContactPage() {
  const contact = useContactSettings();
  const details = [
    { icon: Mail, label: "Email", value: contact.email, href: mailtoHref(contact.email) },
    { icon: Phone, label: "Phone", value: contact.phone, href: telHref(contact.phone) },
    { icon: MessageCircle, label: "WhatsApp", value: "Chat on WhatsApp", href: whatsappHref(contact.whatsapp) },
    { icon: MapPin, label: "Studio", value: "Delhi, India" },
  ];
  return (
    <>
      <section className="relative overflow-hidden bg-foreground">
        <img
          src={contactHero}
          alt="Design Diaries gym interior — oak slat ceiling, terracotta floor and strength equipment"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <span className="absolute inset-0 bg-foreground/50" />
        <div className="relative mx-auto max-w-[110rem] px-5 pt-28 pb-12 text-background md:px-10 md:pt-32 md:pb-16">
          <Reveal>
            <p className="label-caps text-primary">Contact Us</p>
            <h1 className="display-lg mt-5 max-w-3xl">LET&apos;S START A CONVERSATION</h1>
            <p className="mt-6 max-w-xl text-background/80">
              For general enquiries, collaborations, press or anything else you would like to discuss,
              reach out to the studio.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto grid max-w-[110rem] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {details.map((d, i) => (
            <Reveal key={d.label} delay={i * 80} className="min-w-0 overflow-hidden bg-background p-8 md:p-10">
              <d.icon className="h-5 w-5 text-primary" />
              <p className="label-caps mt-6 text-muted-foreground">{d.label}</p>
              {d.href ? (
                <a
                  href={d.href}
                  target={d.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className={`mt-2 block font-display text-lg uppercase leading-snug transition-colors duration-300 hover:text-primary md:text-xl ${
                    d.label === "Email" ? "break-all" : "break-words"
                  }`}
                >
                  {d.value}
                </a>
              ) : (
                <p className="mt-2 break-words font-display text-lg uppercase leading-snug md:text-xl">{d.value}</p>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-[110rem] px-5 py-20 md:px-10 md:py-28">
          <Reveal className="max-w-3xl">
            <p className="label-caps text-primary">START A PROJECT</p>
            <h2 className="display-lg mt-5">HAVE A SPACE IN MIND?</h2>
            <p className="mt-6 text-muted-foreground">
              Planning a gym or fitness or wellness space? Share your project with us and let&apos;s see
              how thoughtful gym interior design can bring your vision, function and user experience
              together.
            </p>
            <Link
              to="/start-a-project"
              className="label-caps mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98]"
            >
              LET&apos;S TALK ABOUT YOUR PROJECT →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
