import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import TagManager from "react-gtm-module";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PromoBanner } from "@/components/site/PromoBanner";
import { StickyCTA } from "@/components/site/StickyCTA";
import { ScrollProgress } from "@/components/site/ScrollProgress";
import { ContactSettingsProvider } from "@/hooks/use-contact-settings";
import { HomepageSettingsProvider } from "@/hooks/use-homepage-settings";
import { AboutSettingsProvider } from "@/hooks/use-about-settings";
import { ProjectsProvider } from "@/hooks/use-projects";

function NotFoundComponent() {
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-[110rem] flex-col justify-center px-5 py-28 md:px-10">
      <p className="label-caps text-primary">Error 404</p>
      <h1 className="display-lg mt-5 max-w-4xl">This one's off the floor plan</h1>
      <p className="mt-8 max-w-xl text-lg text-muted-foreground">
        The page you're after has moved, or never existed. Two doors that definitely do — the work,
        and the conversation.
      </p>
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/work"
          className="label-caps border border-input px-7 py-4 transition-all duration-300 hover:border-primary hover:text-primary active:scale-[0.98]"
        >
          View the work
        </Link>
        <Link
          to="/start-a-project"
          className="label-caps bg-primary px-7 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98]"
        >
          Start a project
        </Link>
      </div>
    </section>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="label-caps bg-primary px-5 py-3 text-primary-foreground transition-colors hover:bg-foreground"
          >
            Try again
          </button>
          <a href="/" className="label-caps border border-input px-5 py-3 transition-colors">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Design Diaries — Gym Interior Design Studio, Indore" },
      {
        name: "description",
        content:
          "Specialist interior design for gyms and fitness spaces — built around function, performance and the people who use them.",
      },
      { name: "author", content: "Design Diaries" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Archivo+Black&family=Hind:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    TagManager.initialize({ gtmId: import.meta.env.VITE_GTM_ID });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ContactSettingsProvider>
        <HomepageSettingsProvider>
        <AboutSettingsProvider>
        <ProjectsProvider>
        {!isAdmin && <ScrollProgress />}
        {!isAdmin && <PromoBanner />}
        {!isAdmin && <Header overHero={isHome} />}
        <main className={!isAdmin && isHome ? "-mt-24" : ""}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </main>
        {!isAdmin && <StickyCTA />}
        {!isAdmin && <Footer />}
        </ProjectsProvider>
        </AboutSettingsProvider>
        </HomepageSettingsProvider>
      </ContactSettingsProvider>
    </QueryClientProvider>
  );
}
