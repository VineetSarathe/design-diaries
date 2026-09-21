import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Instagram, Linkedin, Mail, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import feed1 from "@/assets/gallery-1.jpg";
import feed2 from "@/assets/project-1.jpg";
import feed3 from "@/assets/project-2.jpg";
import feed4 from "@/assets/project-4.jpg";
import feed5 from "@/assets/project-5.jpg";
import feed6 from "@/assets/project-6.jpg";
import ctaBg from "@/assets/hero-gym.jpg";
import logoWhite from "@/assets/logo-white.png";
import { useContactSettings } from "@/hooks/use-contact-settings";
import { mailtoHref, whatsappHref } from "@/lib/contact";
import { useInstagramFeed } from "@/hooks/use-instagram-feed";
import { useStartProjectLink } from "@/hooks/use-start-project-link";
import type { InstagramCard } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import { mediaPreviewUrl } from "@/lib/media";

const quick = [
  { label: "Services", to: "/services" as const },
  { label: "Work", to: "/work" as const },
  { label: "Resources", to: "/resources" as const },
  { label: "About Us", to: "/about" as const },
];

const fallbackFeed: InstagramCard[] = [
  { id: "1", caption: "Zoning a 6,000 sq ft floor", link: "", imageUrl: feed1, sortOrder: 1 },
  { id: "2", caption: "Why rubber thickness matters", link: "", imageUrl: feed2, sortOrder: 2 },
  { id: "3", caption: "Mirror lines and sightlines", link: "", imageUrl: feed3, sortOrder: 3 },
  { id: "4", caption: "Cardio deck daylight study", link: "", imageUrl: feed4, sortOrder: 4 },
  { id: "5", caption: "Locker room throughput", link: "", imageUrl: feed5, sortOrder: 5 },
  { id: "6", caption: "Reception as a sales tool", link: "", imageUrl: feed6, sortOrder: 6 },
];

export function Footer() {
  const contact = useContactSettings();
  const { items: feed } = useInstagramFeed("home", fallbackFeed);
  const startProject = useStartProjectLink();

  return (
    <footer className="bg-foreground text-background">
      <Reveal className="mx-auto grid max-w-[110rem] gap-10 px-5 py-14 md:grid-cols-[1.2fr_0.8fr_1fr_1.2fr] md:gap-0 md:px-0 md:py-0">
        <div className="md:border-r md:border-background/12 md:px-10 md:py-16">
          <Link to="/" aria-label="Design Diaries home">
            <img
              src={logoWhite}
              alt="Design Diaries by Sagrika"
              width={330}
              height={102}
              className="h-9 w-auto transition-opacity duration-300 hover:opacity-80"
            />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-background/65">
            Gym interior design specialist, designing fitness spaces that work, designed around movement, performance and the people who use them.
          </p>
        </div>

        <div className="md:border-r md:border-background/12 md:px-10 md:py-16">
          <div className="flex items-center gap-4">
            <p className="label-caps text-[0.65rem] text-background/55">Quick Links</p>
            <span className="h-px flex-1 bg-background/20" />
          </div>
          <ul className="mt-6 space-y-4">
            {quick.map((q) => (
              <li key={q.label}>
                <Link
                  to={q.to}
                  className="text-[1.02rem] transition-colors duration-300 hover:text-primary"
                >
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:border-r md:border-background/12 md:px-10 md:py-16">
          <div className="flex items-center gap-4">
            <p className="label-caps text-[0.65rem] text-background/55">Contact</p>
            <span className="h-px flex-1 bg-background/20" />
          </div>
          <a
            href={whatsappHref(contact.phone)}
            target="_blank"
            rel="noreferrer noopener"
            className="group mt-6 flex items-center gap-3 rounded-full border border-background/25 px-4 py-3 transition-colors duration-300 hover:border-primary"
          >
            <MessageCircle size={20} className="text-primary" />
            <span className="flex-1 text-[1.02rem]">Chat on WhatsApp</span>
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </a>
          <ul className="mt-6 space-y-4 text-[1.02rem]">
            <li>
              <a
                href={mailtoHref(contact.email)}
                className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-primary"
              >
                <Mail size={18} className="text-background/60" /> {contact.email}
              </a>
            </li>
            <li>
              <a
                href={contact.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-primary"
              >
                <Instagram size={18} className="text-background/60" /> Instagram
              </a>
            </li>
            <li>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 transition-colors duration-300 hover:text-primary"
              >
                <Linkedin size={18} className="text-background/60" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <Link
          to={startProject.to}
          hash={startProject.hash}
          onClick={startProject.onClick}
          className="group relative flex min-h-[18rem] items-start overflow-hidden px-6 py-14 md:px-10 md:py-16"
        >
          <img
            src={ctaBg}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-[1200ms] ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/85 to-foreground/40" />
          <span className="relative flex w-full items-center justify-between gap-6">
            <span>
              <span className="label-caps block text-[0.65rem] text-background/60">
                Ready to build
              </span>
              <span className="mt-3 block font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.05] uppercase">
                Start
                <br />
                <span className="text-primary">Planning</span>
                <br />
                Your Gym
              </span>
            </span>
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-background/40 transition-colors duration-300 group-hover:border-primary group-hover:text-primary">
              <ArrowRight
                size={22}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </span>
        </Link>
      </Reveal>

      <div className="border-t border-background/12 py-8">
        <a
          href={contact.instagram}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex items-center gap-3 px-5 md:px-10"
        >
          <Instagram size={18} className="text-primary" />
          <p className="label-caps text-[0.65rem] text-background/60 transition-colors duration-300 group-hover:text-primary">
            Follow on Instagram
          </p>
        </a>
        <InstagramRail feed={feed} instagram={contact.instagram} />
      </div>

      <div
        id="site-footer-legal"
        className="mx-auto flex max-w-[110rem] flex-col gap-3 border-t border-background/12 px-5 py-7 text-xs text-background/50 md:flex-row md:items-center md:justify-between md:px-10 md:pr-56"
      >
        <p>© {new Date().getFullYear()} Design Diaries. All rights reserved.</p>
        <div className="flex flex-wrap gap-6">
          <Link to="/privacy" className="transition-colors hover:text-primary">
            Privacy Policy
          </Link>
          <Link to="/cookies" className="transition-colors hover:text-primary">
            Cookie Policy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-primary">
            Terms & Conditions
          </Link>
          <Link to="/faq" className="transition-colors hover:text-primary">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}

function InstagramRail({ feed, instagram }: { feed: InstagramCard[]; instagram: string }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [activeId, setActiveId] = useState<string | null>(feed[0]?.id ?? null);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const update = () => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        setActiveId(null);
        return;
      }
      const center = el.getBoundingClientRect().left + el.clientWidth / 2;
      let nearest: string | null = null;
      let distance = Number.POSITIVE_INFINITY;
      feed.forEach((item) => {
        const card = cardRefs.current[item.id];
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const nextDistance = Math.abs(rect.left + rect.width / 2 - center);
        if (nextDistance < distance) {
          distance = nextDistance;
          nearest = item.id;
        }
      });
      setActiveId(nearest);
    };

    update();
    el.scrollLeft = 0;
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [feed]);

  return (
    <div
      ref={scrollerRef}
      className="instagram-feed-rail mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 scroll-pl-5 md:snap-none md:px-10 md:scroll-pl-10"
    >
      {feed.map((f) => {
        const isActive = activeId === f.id;
        return (
        <a
          key={f.id}
          ref={(node) => {
            cardRefs.current[f.id] = node;
          }}
          href={f.link || instagram}
          target="_blank"
          rel="noreferrer noopener"
          className={cn(
            "group relative h-32 w-48 shrink-0 snap-start overflow-hidden border transition-colors duration-300 hover:border-primary",
            isActive ? "border-primary" : "border-background/15",
          )}
        >
          <img
            src={mediaPreviewUrl(f.imageUrl, 480)}
            alt={f.caption}
            loading="lazy"
            className={cn(
              "absolute inset-0 h-full w-full object-cover opacity-80 transition-[transform,opacity] duration-700 ease-out group-hover:scale-105 group-hover:opacity-100",
              isActive && "scale-105 opacity-100",
            )}
          />
          <ArrowUpRight
            size={16}
            className={cn(
              "absolute top-3 right-3 text-background/70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary",
              isActive && "translate-x-0.5 text-primary",
            )}
          />
        </a>
        );
      })}
    </div>
  );
}
