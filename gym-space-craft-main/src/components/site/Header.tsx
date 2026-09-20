import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecretClicks } from "@/hooks/use-secret-clicks";
import { useProjects } from "@/hooks/use-projects";
import logoBlack from "@/assets/logo-black.png";
import logoWhite from "@/assets/logo-white.png";
import thumbGym from "@/assets/project-1.jpg";
import thumbWellness from "@/assets/project-4.jpg";
import thumbBlog from "@/assets/gallery-1.jpg";
import thumbDownloads from "@/assets/floorplan.jpg";
import thumbAbout from "@/assets/founder.webp";
import thumbCareers from "@/assets/project-6.jpg";
import thumbContact from "@/assets/project-5.jpg";

type Sub = { label: string; to: string; hash?: string; note?: string; img?: string };
type NavItem = { label: string; to: string; subs?: Sub[] };

export const NAV: NavItem[] = [
  { label: "Services", to: "/services" },
  {
    label: "Work",
    to: "/work",
    subs: [
      { label: "Gym Projects", to: "/work", note: "Strength & performance floors", img: thumbGym },
      { label: "Fitness Studios", to: "/work", note: "Pilates, yoga, recovery", img: thumbWellness },
    ],
  },
  {
    label: "Resources",
    to: "/resources",
    subs: [
      { label: "Blog", to: "/resources", note: "Notes from the floor", img: thumbBlog },
      { label: "Downloads", to: "/resources", hash: "downloads", note: "Guides & checklists", img: thumbDownloads },
    ],
  },
  {
    label: "Company",
    to: "/about",
    subs: [
      { label: "About Us", to: "/about", note: "The studio & the founder", img: thumbAbout },
      { label: "Careers", to: "/careers", note: "Join the studio", img: thumbCareers },
      { label: "Contact Us", to: "/contact", note: "Talk to us directly", img: thumbContact },
    ],
  },
];

const COMPACT_NAV = ["Services", "Work", "Company"];

function ListMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  return (
    <div className="bg-foreground/95 py-2 text-background backdrop-blur-xl">
      {item.subs?.map((s, si) => (
        <Link
          key={s.label}
          to={s.to}
          {...(s.hash ? { hash: s.hash } : {})}
          onClick={onNavigate}
          className="group/sub relative flex items-center gap-5 border-b border-background/10 px-6 py-4 transition-colors duration-300 last:border-b-0 hover:bg-background/[0.06]"
        >
          <span className="absolute top-0 bottom-0 left-0 w-[3px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover/sub:scale-y-100" />
          <span className="label-caps w-7 text-[0.7rem] text-background/40 transition-colors duration-300 group-hover/sub:text-primary">
            0{si + 1}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[0.95rem] font-medium transition-colors duration-300 group-hover/sub:text-primary">
              {s.label}
            </span>
            {s.note && <span className="mt-0.5 block text-xs text-background/50">{s.note}</span>}
          </span>
          <ArrowRight
            size={17}
            className="text-background/40 transition-all duration-300 group-hover/sub:translate-x-1 group-hover/sub:text-primary"
          />
        </Link>
      ))}
    </div>
  );
}

function MegaMenu({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { projects } = useProjects();
  const featured = projects.slice(0, 3);
  const [fi, setFi] = useState(0);
  const f = featured[fi];
  const step = (d: number) => {
    if (!featured.length) return;
    setFi((v) => (v + d + featured.length) % featured.length);
  };

  return (
    <div className="grid bg-foreground/95 text-background backdrop-blur-xl md:grid-cols-2">
      <div className="border-background/10 p-6 md:border-r">
        <div className="flex items-center gap-4">
          <p className="label-caps text-[0.65rem] text-background/60">Explore {item.label}</p>
          <span className="h-px flex-1 bg-background/20" />
        </div>
        <div className="mt-4">
          {item.subs?.map((s, si) => (
            <Link
              key={s.label}
              to={s.to}
              {...(s.hash ? { hash: s.hash } : {})}
              onClick={onNavigate}
              className="group/sub relative flex items-center gap-5 border-b border-background/10 py-4 pl-4 transition-colors duration-300 hover:bg-background/[0.06]"
            >
              <span className="absolute top-0 bottom-0 left-0 w-[2px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover/sub:scale-y-100" />
              <span className="label-caps w-6 text-[0.7rem] text-background/40 transition-colors duration-300 group-hover/sub:text-primary">
                0{si + 1}
              </span>
              {s.img && (
                <span className="hidden h-12 w-16 shrink-0 overflow-hidden border border-background/15 sm:block">
                  <img
                    src={s.img}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover/sub:scale-105 group-hover/sub:opacity-100"
                  />
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="block text-[0.95rem] font-medium transition-colors duration-300 group-hover/sub:text-primary">
                  {s.label}
                </span>
                {s.note && <span className="mt-0.5 block text-xs text-background/55">{s.note}</span>}
              </span>
              <ArrowRight
                size={17}
                className="mr-2 text-background/50 transition-all duration-300 group-hover/sub:translate-x-1 group-hover/sub:text-primary"
              />
            </Link>
          ))}
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-3">
          <p className="label-caps text-[0.65rem] text-background/60">Featured</p>
          <span className="h-px flex-1 bg-background/20" />
          <span className="label-caps text-[0.65rem] text-background/45">
            {featured.length ? `0${fi + 1} / 0${featured.length}` : "00 / 00"}
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              aria-label="Previous featured project"
              onClick={() => step(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-background/25 transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              aria-label="Next featured project"
              onClick={() => step(1)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-background/25 transition-colors duration-300 hover:border-primary hover:text-primary"
            >
              <ChevronRight size={14} />
            </button>
          </span>
        </div>

        {f ? (
        <Link
          to="/work/$slug"
          params={{ slug: f.slug }}
          onClick={onNavigate}
          className="group/f mt-4 block"
        >
          <span className="block aspect-[16/9] overflow-hidden border border-background/15">
            <img
              key={f.card}
              src={f.card}
              alt={`${f.name}, ${f.location}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/f:scale-[1.04]"
            />
          </span>
          <span className="mt-4 flex items-end justify-between gap-4">
            <span>
              <span className="block font-display text-base uppercase tracking-wide">
                {f.name}, {f.location.split(",")[0]}
              </span>
              <span className="label-caps mt-1 block text-[0.6rem] text-background/55">
                {f.area} floor rezoned
              </span>
            </span>
            <span className="label-caps inline-flex items-center gap-2 text-[0.65rem] text-primary">
              View
              <ArrowUpRight size={14} className="transition-transform duration-300 group-hover/f:translate-x-1" />
            </span>
          </span>
        </Link>
        ) : null}
      </div>
    </div>
  );
}

export function Header({ overHero = false }: { overHero?: boolean }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const openAdminLogin = useSecretClicks(() => {
    void navigate({ to: "/admin/login" });
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const compact = scrolled || !overHero;
  const onDark = overHero && !scrolled;
  const headerOnDark = mobile || onDark;
  const visibleNav = scrolled ? NAV.filter((n) => COMPACT_NAV.includes(n.label)) : NAV;

  return (
    <header
      onMouseLeave={() => setOpen(null)}
      className={cn(
        "sticky top-0 z-50",
        mobile
          ? "border-b border-background/10 bg-foreground shadow-none transition-none"
          : compact
          ? "border-b border-border/60 bg-background/85 shadow-[0_1px_24px_-18px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500"
          : "border-b border-white/10 bg-transparent transition-[background-color,border-color,box-shadow] duration-500",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[110rem] items-center justify-between gap-8 px-5 md:px-10",
          mobile ? "transition-none" : "transition-all duration-500",
          compact ? "h-[4.25rem]" : "h-24",
          headerOnDark ? "text-background" : "text-foreground",
        )}
      >
        <Link
          to="/"
          onClick={openAdminLogin}
          className="group flex select-none items-center gap-2"
          aria-label="Design Diaries home"
        >
          <span
            className={cn(
              "relative block w-[9.7rem] md:w-[11.3rem]",
              compact ? "h-6 md:h-7" : "h-7 md:h-9",
            )}
          >
            <img
              src={logoBlack}
              alt="Design Diaries by Sagrika"
              width={330}
              height={102}
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-300 group-hover:opacity-80",
                headerOnDark ? "opacity-0" : "opacity-100",
                mobile && "transition-none",
              )}
            />
            <img
              src={logoWhite}
              alt=""
              aria-hidden="true"
              width={330}
              height={102}
              className={cn(
                "absolute inset-0 h-full w-full object-contain object-left transition-opacity duration-300 group-hover:opacity-80",
                headerOnDark ? "opacity-100" : "opacity-0",
                mobile && "transition-none",
              )}
            />
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-9 lg:flex">
          {visibleNav.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => setOpen(item.label)}
              onMouseLeave={() => setOpen(null)}
            >
              <Link
                to={item.to}
                className={cn(
                  "label-caps relative block py-2 text-[0.82rem] tracking-[0.22em] transition-colors duration-300 hover:text-primary",
                  open === item.label && "text-primary",
                )}
                activeProps={{ "data-active": "true" }}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-[0.35rem] left-0 h-[2px] w-full origin-left bg-primary transition-transform duration-300",
                    open === item.label ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>

              {item.subs && (
                <div
                  className={cn(
                    "absolute top-full pt-4 transition-all duration-300",
                    item.label === "Work" ? "left-1/2 w-[46rem] -translate-x-1/2" : "left-1/2 w-[26rem] -translate-x-1/2",
                    open === item.label
                      ? "visible translate-y-0 opacity-100"
                      : "pointer-events-none invisible -translate-y-2 opacity-0",
                  )}
                >
                  <div className="max-h-[70vh] overflow-auto border border-background/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]">
                    {item.label === "Work" ? (
                      <MegaMenu item={item} onNavigate={() => setOpen(null)} />
                    ) : (
                      <ListMenu item={item} onNavigate={() => setOpen(null)} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/start-a-project"
            className="label-caps group relative hidden overflow-hidden border border-primary bg-primary px-6 py-3 tracking-[0.2em] text-primary-foreground transition-all duration-300 active:scale-[0.97] sm:inline-flex sm:items-center sm:gap-2"
          >
            <span className="relative">Start a Project</span>
            <ArrowRight size={14} className="relative transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
          <button
            aria-label="Open menu"
            onClick={() => setMobile((v) => !v)}
            className="p-2 transition-transform duration-200 active:scale-90 lg:hidden"
          >
            {mobile ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobile && (
        <div className="animate-in slide-in-from-top-2 max-h-[calc(100svh-4.25rem)] overflow-y-auto overscroll-contain border-t border-background/10 bg-foreground px-5 py-5 text-background duration-300 md:px-10 lg:hidden">
          {NAV.map((item, i) => {
            const expanded = expandedMobile === item.label;
            return (
              <div key={item.label} className="border-b border-background/12 py-1">
                {item.subs ? (
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedMobile(expanded ? null : item.label)}
                    className="group flex w-full items-center gap-4 py-4 text-left"
                  >
                    <span
                      className={cn(
                        "label-caps w-7 text-[0.7rem] transition-colors duration-300",
                        expanded ? "text-primary" : "text-background/40 group-hover:text-primary",
                      )}
                    >
                      0{i + 1}
                    </span>
                    <span
                      className={cn(
                        "flex-1 font-display text-lg uppercase tracking-wide transition-colors duration-300",
                        expanded ? "text-primary" : "group-hover:text-primary",
                      )}
                    >
                      {item.label}
                    </span>
                    <ChevronRight
                      size={18}
                      className={cn(
                        "transition-all duration-300",
                        expanded ? "rotate-90 text-primary" : "text-background/40 group-hover:text-primary",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setMobile(false)}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="label-caps w-7 text-[0.7rem] text-background/40 group-hover:text-primary">
                      0{i + 1}
                    </span>
                    <span className="flex-1 font-display text-lg uppercase tracking-wide group-hover:text-primary">
                      {item.label}
                    </span>
                    <ArrowUpRight size={18} className="text-background/40 group-hover:text-primary" />
                  </Link>
                )}
                {item.subs && expanded && (
                  <div className="animate-in slide-in-from-top-1 pb-3 pl-11 duration-300">
                    {item.subs.map((s, si) => (
                      <Link
                        key={s.label}
                        to={s.to}
                        {...(s.hash ? { hash: s.hash } : {})}
                        onClick={() => setMobile(false)}
                        className="group/sub relative flex items-center gap-4 border-b border-background/10 py-3 transition-colors duration-300 last:border-b-0 hover:bg-background/[0.06]"
                      >
                        <span className="absolute top-0 bottom-0 -left-4 w-[3px] origin-top scale-y-0 bg-primary transition-transform duration-300 group-hover/sub:scale-y-100" />
                        <span className="label-caps w-6 text-[0.65rem] text-background/40 transition-colors duration-300 group-hover/sub:text-primary">
                          0{si + 1}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm transition-colors duration-300 group-hover/sub:text-primary">
                            {s.label}
                          </span>
                          {s.note && <span className="block text-xs text-background/45">{s.note}</span>}
                        </span>
                        <ArrowRight
                          size={15}
                          className="text-background/40 transition-all duration-300 group-hover/sub:translate-x-1 group-hover/sub:text-primary"
                        />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <Link
            to="/start-a-project"
            onClick={() => setMobile(false)}
            className="label-caps mt-6 flex items-center justify-center gap-3 bg-primary px-5 py-4 text-center text-primary-foreground"
          >
            Start a Project
            <ArrowRight size={15} />
          </Link>
        </div>
      )}
    </header>
  );
}
