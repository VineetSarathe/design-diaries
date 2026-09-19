import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Reveal } from "@/components/site/Reveal";
import { mailtoHref, whatsappHref } from "@/lib/contact";

const EMAIL = "designdiariesbysagrika@gmail.com";
const PHONE = "+91 96224 34242";
const SITE = "https://www.designdiaries.co";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Design Diaries" },
      {
        name: "description",
        content:
          "Terms & Conditions for using the Design Diaries by Sagrika website, including content use, project enquiries and legal notices.",
      },
      { property: "og:title", content: "Terms & Conditions | Design Diaries" },
      {
        property: "og:description",
        content: "The rules for using www.designdiaries.co.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <section className="mx-auto max-w-[110rem] px-5 pt-28 pb-12 md:px-10 md:pt-36 md:pb-16">
        <Reveal>
          <p className="label-caps text-primary">Legal</p>
          <h1 className="display-lg mt-5 max-w-4xl">Terms &amp; Conditions</h1>
          <p className="mt-6 label-caps text-muted-foreground">Last updated: 20 September 2026</p>
          <div className="mt-8 max-w-2xl space-y-4 text-lg text-muted-foreground">
            <p>Welcome to Design Diaries by Sagrika.</p>
            <p>
              These Terms &amp; Conditions explain the basic rules for using{" "}
              <a href={SITE} className="text-foreground underline decoration-primary/40 underline-offset-4 hover:text-primary">
                www.designdiaries.co
              </a>
              . By visiting or using our website, you agree to follow these terms.
            </p>
            <p>If you do not agree with these terms, please do not use the website.</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[110rem] px-5 pb-20 md:px-10 md:pb-28">
        <div className="max-w-3xl space-y-16">
          <Section n="01" title="About the website">
            <p>
              Design Diaries by Sagrika is an interior design practice by Sagrika Saraf, specialising
              in gym, fitness and wellness spaces.
            </p>
            <p>The website is intended to:</p>
            <List
              items={[
                "Showcase our work and projects",
                "Explain our design services",
                "Share insights and articles",
                "Provide useful resources and downloads",
                "Allow potential clients to enquire about projects",
                "Provide ways to contact us",
              ]}
            />
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
          </Section>

          <Section n="02" title="Using our website">
            <p>
              You are welcome to explore and use the website for legitimate personal, professional or
              informational purposes.
            </p>
            <p>When using the website, you agree not to:</p>
            <List
              items={[
                "Use the website for unlawful purposes",
                "Attempt to gain unauthorised access to any part of the website",
                "Interfere with the website's operation or security",
                "Introduce malicious code, viruses or harmful material",
                "Copy or reproduce website content without permission",
                "Use our content, images or designs in a way that could misrepresent their ownership or origin",
                "Use information from the website to create misleading or fraudulent material",
              ]}
            />
            <p>
              We may restrict or block access if we reasonably believe the website is being misused.
            </p>
          </Section>

          <Section n="03" title="Our content and project work">
            <p>
              The content on this website belongs to Design Diaries by Sagrika or is used with
              appropriate permission.
            </p>
            <p>This includes, where applicable:</p>
            <List
              items={[
                "Website copy",
                "Project descriptions",
                "Design concepts",
                "Project photographs",
                "Videos",
                "Graphics",
                "Illustrations",
                "Floor plans",
                "Drawings",
                "Case studies",
                "Articles and insights",
                "Downloadable resources",
                "Logo and brand elements",
              ]}
            />
            <p>
              You may view the content for your own reference, but you may not reproduce, republish,
              modify, distribute, sell or commercially use it without our prior written permission.
            </p>
          </Section>

          <Section n="04" title="Project photographs and case studies">
            <p>
              The projects shown on this website represent work completed or developed by Design
              Diaries by Sagrika.
            </p>
            <p>
              Project information, photographs, drawings and descriptions are presented to explain our
              design approach and experience.
            </p>
            <p>Some project details may be simplified for presentation purposes.</p>
            <p>
              You should not assume that every design shown on the website can be reproduced exactly
              for another site. Each project is developed according to its own site conditions,
              requirements, budget, users and practical considerations.
            </p>
          </Section>

          <Section n="05" title="Website content and information">
            <p>
              We make reasonable efforts to keep the information on the website accurate and useful.
            </p>
            <p>
              However, the website may contain information that changes over time, including services,
              project details, resources, articles and other content.
            </p>
            <p>
              We do not guarantee that every piece of information on the website will always be
              complete, current or error-free.
            </p>
            <p>We may update, change or remove website content at any time without prior notice.</p>
          </Section>

          <Section n="06" title="Design insights and resources">
            <p>
              Our articles, guides, checklists, downloads and other resources are provided for general
              informational purposes.
            </p>
            <p>
              They are intended to help visitors think through design, planning and fitness-space
              requirements.
            </p>
            <p>They should not be treated as a substitute for a site-specific professional assessment.</p>
            <p>Actual design decisions may depend on factors such as:</p>
            <List
              items={[
                "Site conditions",
                "Building regulations",
                "Structural requirements",
                "Equipment specifications",
                "Services and utilities",
                "Fire and safety requirements",
                "Local requirements",
                "Project budget",
                "Contractor capabilities",
              ]}
            />
            <p>
              Always verify project-specific requirements before making construction or design
              decisions.
            </p>
          </Section>

          <Section n="07" title="Project enquiries">
            <p>
              Submitting an enquiry through our website does not automatically create a client
              relationship or confirm that Design Diaries by Sagrika has agreed to undertake your
              project.
            </p>
            <p>
              Information submitted through the enquiry form helps us understand your requirements and
              decide how we may be able to assist.
            </p>
            <p>
              A project engagement begins only after the scope, services, commercial terms and other
              relevant details have been discussed and agreed upon separately.
            </p>
          </Section>

          <Section n="08" title="No guarantee of project availability">
            <p>
              Submitting a project enquiry does not guarantee that we will accept or undertake the
              project.
            </p>
            <p>Our availability may depend on factors such as:</p>
            <List
              items={[
                "Project location",
                "Scope of work",
                "Project timeline",
                "Current workload",
                "Project requirements",
                "Fit with our services",
              ]}
            />
            <p>We will communicate with you regarding the next steps after reviewing your enquiry.</p>
          </Section>

          <Section n="09" title="Third-party links and services">
            <p>Our website may include links to third-party websites, platforms or services.</p>
            <p>
              These links may be provided for convenience or to help you access additional information.
            </p>
            <p>
              We do not control these third-party websites and are not responsible for their content,
              availability, security or privacy practices.
            </p>
            <p>Your use of a third-party website is subject to that website's own terms and policies.</p>
          </Section>

          <Section n="10" title="Website availability">
            <p>
              We aim to keep the website available and working properly, but we cannot guarantee
              uninterrupted access at all times.
            </p>
            <p>The website may occasionally be unavailable because of:</p>
            <List
              items={[
                "Maintenance",
                "Updates",
                "Technical issues",
                "Hosting or infrastructure problems",
                "Security measures",
                "Circumstances outside our control",
              ]}
            />
            <p>
              We may modify, suspend or temporarily discontinue parts of the website when necessary.
            </p>
          </Section>

          <Section n="11" title="Website security">
            <p>We take reasonable steps to protect our website and its users.</p>
            <p>However, no website or online service can be guaranteed to be completely secure.</p>
            <p>
              You should also take reasonable precautions when using the internet, including keeping
              your devices, browsers and security software updated.
            </p>
          </Section>

          <Section n="12" title="Intellectual property">
            <p>
              All intellectual property rights in the original content created by Design Diaries by
              Sagrika remain with the respective rights holder.
            </p>
            <p>
              Nothing on this website gives you ownership of our designs, photographs, written
              content, drawings, graphics, videos, brand elements or other intellectual property.
            </p>
            <p>
              If you would like to reproduce or use any of our content, please contact us for
              permission.
            </p>
          </Section>

          <Section n="13" title="User-submitted content">
            <p>
              If you voluntarily submit photographs, drawings, project references, files or other
              information through our website, you confirm that you have the right to share that
              material with us.
            </p>
            <p>You should not submit material that:</p>
            <List
              items={[
                "Belongs to someone else without permission",
                "Contains unnecessary confidential information",
                "Violates another person's rights",
                "Contains unlawful or harmful material",
              ]}
            />
            <p>
              We may use submitted information for the purpose for which you provided it, subject to
              our Privacy Policy.
            </p>
          </Section>

          <Section n="14" title="Limitation of liability">
            <p>
              We make reasonable efforts to provide a useful and reliable website, but we cannot
              guarantee that the website or its content will always be completely accurate,
              uninterrupted or free from errors.
            </p>
            <p>
              To the extent permitted by applicable law, Design Diaries by Sagrika shall not be
              responsible for losses arising solely from your reliance on general website content,
              articles, downloadable resources or third-party information.
            </p>
            <p>
              For an actual design project, specific advice and decisions should be based on the
              project scope, site conditions and professional assessment.
            </p>
          </Section>

          <Section n="15" title="Indemnity">
            <p>
              You agree to use the website responsibly and not to use it in a way that violates these
              Terms &amp; Conditions or applicable law.
            </p>
            <p>
              To the extent permitted by applicable law, you may be responsible for losses or claims
              arising from your misuse of the website, violation of these terms or infringement of
              another person's rights.
            </p>
          </Section>

          <Section n="16" title="Privacy">
            <p>
              Your use of our website is also subject to our Privacy Policy, which explains how we
              collect and handle personal information.
            </p>
            <p>
              You can read our Privacy Policy here:{" "}
              <Link to="/privacy" className="label-caps text-foreground hover:text-primary">
                Privacy Policy →
              </Link>
            </p>
            <p>
              Our use of cookies and analytics technologies is explained separately in our Cookie
              Policy.{" "}
              <Link to="/cookies" className="label-caps text-foreground hover:text-primary">
                Cookie Policy →
              </Link>
            </p>
          </Section>

          <Section n="17" title="Changes to these terms">
            <p>
              We may update these Terms &amp; Conditions from time to time as our website, services or
              business practices change.
            </p>
            <p>When we make changes, we will update the Last Updated date at the top of this page.</p>
            <p>
              Your continued use of the website after an update means that you acknowledge the revised
              terms.
            </p>
          </Section>

          <Section n="18" title="Governing law">
            <p>These Terms &amp; Conditions shall be governed by the laws applicable in India.</p>
            <p>
              Any dispute relating to the use of this website or these Terms &amp; Conditions will be
              subject to the jurisdiction of the appropriate courts in Delhi, India, subject to
              applicable law.
            </p>
          </Section>

          <Section n="19" title="Contact us">
            <p>If you have any questions about these Terms &amp; Conditions, you can contact:</p>
            <p>
              Sagrika Saraf
              <br />
              Design Diaries by Sagrika
              <br />
              Delhi, India
            </p>
            <p>
              Email:{" "}
              <a href={mailtoHref(EMAIL, "Terms & Conditions Enquiry")} className="text-foreground hover:text-primary">
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
            <p>Subject: Terms &amp; Conditions Enquiry</p>
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
