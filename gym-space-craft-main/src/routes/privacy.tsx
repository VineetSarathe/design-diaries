import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";
import { mailtoHref, whatsappHref } from "@/lib/contact";
import { loadRouteSeo, routePageSeo } from "@/lib/page-seo";

const EMAIL = "designdiariesbysagrika@gmail.com";
const PHONE = "+91 96224 34242";
const SITE = "https://www.designdiaries.co";

export const Route = createFileRoute("/privacy")({
  loader: () => loadRouteSeo("/privacy"),
  head: ({ loaderData }) => routePageSeo("/privacy", undefined, loaderData),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <>
      <section className="mx-auto max-w-[110rem] px-5 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <h1 className="display-lg mt-5 max-w-4xl">Privacy Policy</h1>
          <p className="mt-6 label-caps text-muted-foreground">Last updated: 20 September 2026</p>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted-foreground">
            <p>
              At Design Diaries by Sagrika, we respect your privacy and want you to feel comfortable
              when you visit our website or get in touch with us.
            </p>
            <p>
              This Privacy Policy explains what information we may collect through{" "}
              <a
                href={SITE}
                className="text-foreground underline decoration-primary/40 underline-offset-4 hover:text-primary"
              >
                www.designdiaries.co
              </a>
              , how we use it, and how we protect it.
            </p>
            <p>
              Website:{" "}
              <a href={SITE} className="text-foreground hover:text-primary">
                www.designdiaries.co
              </a>
              <br />
              Name: Sagrika Saraf
              <br />
              Location: Delhi, India
              <br />
              Email:{" "}
              <a href={mailtoHref(EMAIL)} className="text-foreground hover:text-primary">
                {EMAIL}
              </a>
              <br />
              Phone / WhatsApp:{" "}
              <a href={whatsappHref(PHONE)} className="text-foreground hover:text-primary">
                {PHONE}
              </a>
            </p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 pb-20 md:px-10 md:pb-28">
        <div className="max-w-3xl space-y-16">
          <Section n="01" title="What information we collect">
            <p>
              When you contact us, enquire about a project, download a resource or use certain
              features of our website, you may choose to share information such as:
            </p>
            <List
              items={[
                "Your name",
                "Phone or WhatsApp number",
                "Email address",
                "City or project location",
                "Project type",
                "Approximate floor area",
                "Details about your project or requirements",
                "Plans, drawings, reference images or other files you choose to upload",
                "Any other information you voluntarily provide to us",
              ]}
            />
            <p>
              Our website may also collect some basic technical information automatically when you
              visit, such as your browser, device type, pages you visit, referring source, IP address
              and general website usage information.
            </p>
          </Section>

          <Section n="02" title="How we use your information">
            <p>
              We use the information you share with us mainly to understand what you need and respond
              appropriately.
            </p>
            <p>This may include:</p>
            <List
              items={[
                "Responding to project enquiries",
                "Understanding your project requirements",
                "Getting in touch with you about your enquiry",
                "Providing information about our services",
                "Providing resources or downloads you have requested",
                "Improving our website and services",
                "Understanding how people use our website",
                "Identifying technical issues and improving website performance",
                "Keeping the website secure",
                "Meeting applicable legal requirements",
              ]}
            />
            <p>
              We do not use your information for purposes that are unrelated to the reason it was
              collected, except where permitted or required by applicable law.
            </p>
          </Section>

          <Section n="03" title="Project files and references">
            <p>
              If you choose to share plans, drawings, reference images or other files with us, we use
              them to understand your project and respond to your requirements.
            </p>
            <p>Please share only the files and information that are relevant to your enquiry.</p>
            <p>
              If a file contains confidential information that is not necessary for us to understand
              your project, we recommend removing it before uploading.
            </p>
          </Section>

          <Section n="04" title="Google Analytics 4">
            <p>We use Google Analytics 4 (GA4) to understand how visitors use our website.</p>
            <p>
              It helps us see things such as which pages are visited, how people move through the
              website, general traffic sources, device information and other website interactions.
            </p>
            <p>
              This information helps us understand what is working on the website and where we can
              improve it.
            </p>
            <p>
              Google Analytics may use cookies and similar technologies for measurement and analytics.
              We do not intentionally send information such as your name, phone number or email
              address to Google Analytics.
            </p>
          </Section>

          <Section n="05" title="Microsoft Clarity">
            <p>
              We use Microsoft Clarity to better understand how people experience and navigate our
              website.
            </p>
            <p>Clarity may help us understand interactions such as:</p>
            <List
              items={[
                "Where visitors click",
                "How visitors scroll through a page",
                "How visitors navigate between pages",
                "How visitors interact with different elements",
                "General session and device information",
                "Areas where visitors may experience difficulty",
              ]}
            />
            <p>
              Clarity can also provide session recordings and interaction insights. Microsoft documents
              cookies such as _clck and _clsk that can be used to associate interactions and sessions.
            </p>
            <p>
              We use Clarity to improve the website and user experience. We do not use it to
              intentionally collect your name, phone number or email address for advertising purposes.
            </p>
            <p>
              Where a cookie consent mechanism is implemented, Clarity can be configured to wait for
              the appropriate consent before setting its cookies.
            </p>
          </Section>

          <Section n="06" title="Google Search Console">
            <p>
              We use Google Search Console to understand how our website appears and performs in
              Google Search.
            </p>
            <p>It helps us monitor things such as:</p>
            <List
              items={[
                "Search queries",
                "Search impressions",
                "Search clicks",
                "Search rankings",
                "Indexed pages",
                "Search-related technical issues",
              ]}
            />
            <p>
              Search Console is used by us as a website and SEO management tool. It is not used as a
              visitor-facing advertising or behavioural tracking tool.
            </p>
          </Section>

          <Section n="07" title="Google PageSpeed Insights">
            <p>
              We use Google PageSpeed Insights to check and improve the technical performance of our
              website.
            </p>
            <p>It helps us understand areas such as:</p>
            <List
              items={[
                "Page loading performance",
                "Mobile performance",
                "Desktop performance",
                "Core Web Vitals",
                "Other technical performance opportunities",
              ]}
            />
            <p>
              We use this information to improve the speed, usability and overall performance of the
              website.
            </p>
          </Section>

          <Section n="08" title="Cookies" id="cookies">
            <p>
              Our website may use cookies and similar technologies for essential website
              functionality, analytics and website performance.
            </p>
            <p>
              The analytics tools currently used on our website include Google Analytics 4 and
              Microsoft Clarity.
            </p>
            <p>
              Some cookies may be necessary for the website to function, while analytics cookies help
              us understand how visitors use the website.
            </p>
            <p>
              For more information about the cookies we use and the choices available to you, please
              see our{" "}
              <Link to="/cookies" className="label-caps text-foreground hover:text-primary">
                Cookie Policy →
              </Link>
            </p>
          </Section>

          <Section n="09" title="How we handle your information">
            <p>We do not sell your personal information.</p>
            <p>
              We may use trusted technology and service providers that help us operate, maintain and
              secure our website.
            </p>
            <p>
              For example, information may be processed through services required for website hosting,
              databases, analytics, security, email or other essential website functions.
            </p>
            <p>
              We may also share information if we are required to do so by applicable law or a lawful
              government or legal request.
            </p>
          </Section>

          <Section n="10" title="How long we keep your information">
            <p>
              We keep personal information only for as long as it is reasonably needed for the purpose
              for which it was collected.
            </p>
            <p>
              For example, information may be retained while we are responding to an enquiry, working
              with you on a project, maintaining necessary business records, resolving an issue or
              meeting a legal requirement.
            </p>
            <p>When information is no longer needed, we may delete or securely dispose of it.</p>
          </Section>

          <Section n="11" title="How we protect your information">
            <p>
              We take reasonable steps to protect the information we hold from unauthorised access,
              misuse, loss or disclosure.
            </p>
            <p>Depending on our website setup, this may include:</p>
            <List
              items={[
                "HTTPS/SSL encryption",
                "Secure access controls",
                "Protected databases",
                "Secure file handling",
                "Website and server security measures",
                "Software and security updates",
                "Backups and recovery measures",
              ]}
            />
            <p>However, no website or online service can be guaranteed to be completely secure.</p>
          </Section>

          <Section n="12" title="Your privacy choices">
            <p>
              Depending on applicable law, you may have rights relating to the personal information we
              hold about you.
            </p>
            <p>These may include asking us to:</p>
            <List
              items={[
                "Provide access to your information",
                "Correct inaccurate information",
                "Delete information where applicable",
                "Withdraw consent where consent is the basis for processing",
                "Address a privacy-related concern",
              ]}
            />
            <p>
              To make a privacy-related request, simply contact us at:{" "}
              <a
                href={mailtoHref(EMAIL, "Privacy Request")}
                className="text-foreground hover:text-primary"
              >
                {EMAIL}
              </a>
            </p>
            <p>We may need to verify your identity before acting on certain requests.</p>
          </Section>

          <Section n="13" title="Third-party websites">
            <p>Our website may include links to other websites or third-party services.</p>
            <p>
              These websites have their own privacy policies and terms. We are not responsible for how
              third-party websites collect or use information.
            </p>
            <p>
              We recommend checking their privacy policies before sharing personal information with
              them.
            </p>
          </Section>

          <Section n="14" title="Children's privacy">
            <p>Our website is intended for a general audience.</p>
            <p>
              We do not knowingly seek to collect personal information from children in circumstances
              where doing so is not permitted by applicable law.
            </p>
          </Section>

          <Section n="15" title="Changes to this policy">
            <p>
              As our website, services or technology evolve, we may update this Privacy Policy from
              time to time.
            </p>
            <p>When we make changes, we will update the Last Updated date at the top of this page.</p>
            <p>
              We encourage you to check this page occasionally so you are aware of any updates.
            </p>
          </Section>

          <Section n="16" title="Contact us">
            <p>
              If you have a question about this Privacy Policy, how we handle your information, or
              want to make a privacy-related request, you can contact:
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
              <a href={mailtoHref(EMAIL, "Privacy Request")} className="text-foreground hover:text-primary">
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
            <p>Subject: Privacy Request</p>
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
  id,
}: {
  n: string;
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <Reveal>
      <h2 id={id} className="scroll-mt-28 font-display text-2xl uppercase">
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
