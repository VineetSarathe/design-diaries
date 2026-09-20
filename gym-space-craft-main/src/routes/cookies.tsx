import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";
import { mailtoHref, whatsappHref } from "@/lib/contact";
import { loadRouteSeo, routePageSeo } from "@/lib/page-seo";

const EMAIL = "designdiariesbysagrika@gmail.com";
const PHONE = "+91 96224 34242";
const SITE = "https://www.designdiaries.co";

export const Route = createFileRoute("/cookies")({
  loader: () => loadRouteSeo("/cookies"),
  head: ({ loaderData }) => routePageSeo("/cookies", undefined, loaderData),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <>
      <section className="mx-auto max-w-[110rem] px-5 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <h1 className="display-lg mt-5 max-w-4xl">Cookie Policy</h1>
          <p className="mt-6 label-caps text-muted-foreground">Last updated: 20 September 2026</p>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted-foreground">
            <p>
              At Design Diaries by Sagrika, we use cookies and similar technologies on{" "}
              <a
                href={SITE}
                className="text-foreground underline decoration-primary/40 underline-offset-4 hover:text-primary"
              >
                www.designdiaries.co
              </a>{" "}
              to help the website function properly, understand how visitors use the website, and
              improve website performance.
            </p>
            <p>
              This Cookie Policy explains what cookies are, how we use them, what types of cookies may
              be used on our website, and the choices available to you.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 pb-20 md:px-10 md:pb-28">
        <div className="max-w-3xl space-y-16">
          <Section n="01" title="What are cookies?">
            <p>Cookies are small text files that are stored on your device when you visit a website.</p>
            <p>
              They allow a website to recognise your browser, remember certain information, understand
              how visitors interact with the website, and improve the overall browsing experience.
            </p>
            <p>
              Cookies may be first-party cookies, set by the website you are visiting, or third-party
              cookies, set by services integrated into the website.
            </p>
          </Section>

          <Section n="02" title="How we use cookies">
            <p>We may use cookies and similar technologies to:</p>
            <List
              items={[
                "Keep the website functioning properly",
                "Maintain website security",
                "Understand website traffic and visitor behaviour",
                "Measure website performance",
                "Improve our website, content and services",
                "Analyse how visitors interact with different pages and features",
              ]}
            />
            <p>
              Our website currently uses Google Analytics 4 (GA4) and Microsoft Clarity for analytics
              and website usage analysis.
            </p>
          </Section>

          <Section n="03" title="Google Analytics 4">
            <p>
              We use Google Analytics 4 (GA4) to understand how visitors interact with our website and
              to improve our website, content and services.
            </p>
            <p>Google Analytics may collect information such as:</p>
            <List
              items={[
                "Website interactions",
                "Session information",
                "Approximate geographic location",
                "Browser and device information",
                "Traffic sources",
                "General website usage information",
              ]}
            />
            <p>
              Google Analytics uses first-party cookies and similar technologies to measure website
              interactions and distinguish users and sessions.
            </p>
            <p>
              The information helps us understand website traffic, visitor behaviour and overall
              website performance.
            </p>
            <p>
              We do not intentionally send personally identifiable information such as your name,
              phone number or email address to Google Analytics.
            </p>
          </Section>

          <Section n="04" title="Microsoft Clarity">
            <p>
              We use Microsoft Clarity to understand how visitors interact with our website and to
              identify areas where the website experience can be improved.
            </p>
            <p>Clarity may collect information about interactions such as:</p>
            <List
              items={[
                "Clicks",
                "Scroll behaviour",
                "Page interactions",
                "Navigation behaviour",
                "Session activity",
                "General device and browser information",
              ]}
            />
            <p>
              Clarity may use cookies including _clck and _clsk. Microsoft describes _clck as a cookie
              that persists a Clarity user ID and preferences, while _clsk connects multiple page
              views into a Clarity session recording.
            </p>
            <p>
              Clarity is used to analyse website usability and user experience. It is not used by us
              to intentionally collect information such as your name, phone number or email address
              for advertising purposes.
            </p>
            <p>
              Microsoft Clarity provides consent controls that can prevent its cookies from being set
              until the appropriate consent signal is received.
            </p>
          </Section>

          <Section n="05" title="Types of cookies we may use">
            <p className="font-display text-lg uppercase text-foreground">A. Essential cookies</p>
            <p>
              These cookies may be necessary for the basic operation, security and functionality of
              the website.
            </p>
            <p>
              They help the website operate correctly and may be used for essential technical
              functions.
            </p>
            <p>
              Where a cookie is necessary for the website to function, it may not be possible to
              disable it through cookie preference controls without affecting website functionality.
            </p>
            <p className="font-display text-lg uppercase text-foreground">B. Analytics cookies</p>
            <p>Analytics cookies help us understand how visitors use our website.</p>
            <p>We may use analytics technologies from:</p>
            <List items={["Google Analytics 4", "Microsoft Clarity"]} />
            <p>
              These tools help us understand website traffic, visitor behaviour, page performance and
              user experience.
            </p>
          </Section>

          <Section n="06" title="Your cookie choices">
            <p>
              Where applicable, you may be provided with options to accept, reject or manage
              non-essential analytics cookies.
            </p>
            <p>
              If you reject analytics cookies, certain information about your visit may not be
              included in our analytics reports.
            </p>
            <p>
              You can also control or delete cookies through your browser settings. Most browsers
              allow you to block or delete cookies through their privacy or security settings.
            </p>
            <p>Please note that disabling certain cookies may affect some website functionality.</p>
          </Section>

          <Section n="07" title="Microsoft Clarity consent">
            <p>
              Where a cookie consent mechanism is implemented on our website, Microsoft Clarity may
              be configured to respect the visitor's consent preference.
            </p>
            <p>
              Microsoft's current Consent Mode allows Clarity to set its cookies and provide full
              session tracking when the relevant consent is granted. If consent is denied, Clarity can
              operate without setting its first-party and third-party cookies.
            </p>
            <p>
              Our website developer should ensure that the consent mechanism and Clarity
              implementation are correctly connected so that visitor preferences are respected.
            </p>
          </Section>

          <Section n="08" title="Google Analytics consent">
            <p>
              Where applicable, our website may use Google's consent-related controls to communicate
              visitor preferences to Google Analytics.
            </p>
            <p>
              This allows analytics-related data collection to be adjusted according to the visitor's
              consent choices.
            </p>
            <p>
              The exact behaviour depends on the consent-management and analytics configuration
              implemented on the website.
            </p>
          </Section>

          <Section n="09" title="Other Google tools">
            <p>
              We also use Google Search Console and Google PageSpeed Insights as website management
              and performance tools.
            </p>
            <p>
              These tools are used primarily by us to monitor search performance and website
              performance. They are not treated in this Cookie Policy as visitor-facing cookie
              analytics tools like GA4 or Microsoft Clarity.
            </p>
          </Section>

          <Section n="10" title="Third-party services">
            <p>Our current website analytics setup includes:</p>
            <p>
              Google Analytics 4 (GA4)
              <br />
              Used for website analytics and measurement.
            </p>
            <p>
              Microsoft Clarity
              <br />
              Used for website behaviour analysis and user-experience insights.
            </p>
            <p>
              We do not currently use Meta Pixel, Cloudinary, a CRM tracking platform or a third-party
              calendar tracking tool on the website.
            </p>
            <p>
              If additional third-party services that use cookies or similar technologies are
              introduced in the future, this Cookie Policy may be updated accordingly.
            </p>
          </Section>

          <Section n="11" title="Changes to this Cookie Policy">
            <p>We may update this Cookie Policy from time to time to reflect changes in:</p>
            <List
              items={[
                "Our website",
                "Cookies and technologies used",
                "Analytics configuration",
                "Third-party services",
                "Applicable legal or regulatory requirements",
              ]}
            />
            <p>Any changes will be posted on this page with a revised Last Updated date.</p>
          </Section>

          <Section n="12" title="Contact us">
            <p>
              If you have any questions about this Cookie Policy or how cookies are used on our
              website, you can contact:
            </p>
            <p>
              Sagrika Saraf
              <br />
              Design Diaries by Sagrika
              <br />
              Delhi, India
            </p>
            <p>
              Email:{" "}
              <a
                href={mailtoHref(EMAIL, "Cookie Policy Enquiry")}
                className="text-foreground hover:text-primary"
              >
                {EMAIL}
              </a>
              <br />
              Phone / WhatsApp:{" "}
              <a href={whatsappHref(PHONE)} className="text-foreground hover:text-primary">
                {PHONE}
              </a>
              <br />
              Website:{" "}
              <a href={SITE} className="text-foreground hover:text-primary">
                www.designdiaries.co
              </a>
            </p>
            <p>Subject: Cookie Policy Enquiry</p>
          </Section>
        </div>
      </section>
    </>
  );
}

function Section({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <h2 className="font-display text-2xl uppercase">
        <span className="text-primary">{n}.</span> {title}
      </h2>
      <div className="mt-5 space-y-4 text-muted-foreground">{children}</div>
    </Reveal>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 pl-1">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="text-primary">—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
