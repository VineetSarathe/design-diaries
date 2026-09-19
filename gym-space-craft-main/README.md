# Dummy testing

Build a website for "Design Diaries" — a specialist gym & fitness interior design studio founded by Sagrika, based in Indore, India. This is NOT a generic interior design portfolio site and NOT a gym-membership site. Read the positioning carefully before building anything.

POSITIONING (must come through in every section)

Design Diaries designs gym and fitness interiors around how the space is actually used and how the business runs — not aesthetics-first decoration. Sagrika has designed 15+ gyms. Her edge is accumulated, function-first expertise: equipment placement, circulation, durability, business impact — not a decorative "style." The site must make a first-time visitor understand within seconds: (1) this is a GYM/FITNESS interior specialist, not a generalist, (2) there's a real project track record behind that claim, (3) the obvious next step is to enquire.

Every section of the site should answer one of three questions: Why you? Why should I trust you? How do I start? Sequence overall: DESIRE → PROOF → EXPERTISE → TRUST → CONVERSATION.

VISUAL DIRECTION

"Premium fitness energy × architectural sophistication." Not a beige interior-design grid, not an all-black hardcore-gym aesthetic, not a luxury-lifestyle site that hides what the studio does.

- Palette: warm neutrals / cream base (like the reference wireframe) with a confident terracotta/rust-orange accent for CTAs and category labels, and near-black for text and footer.

- Typography: a bold, slightly condensed display serif or high-contrast serif for large headlines (e.g. "MORE THAN INTERIORS", "BUILD A BRIGHTER TOMORROW"), paired with a clean grotesk sans for body copy and nav. Big confident type, generous letter-spacing on small caps labels (e.g. "D E S I G N / P E O P L E / P E R F O R M A N C E").

- Photography-led: full-bleed real gym/interior imagery does the heavy lifting — treat every image block as hero-quality, not thumbnail-quality.

- Reference feel: https://www.vanrenenhanbury.com/ and https://www.studiohollond.com/ for nav/type sophistication; https://omnificgroup.com/ for homepage rhythm.

ANIMATION & INTERACTION SYSTEM (this is a key differentiator — implement all of these)

- On page load: headline text fades/slides in first, THEN the hero image/video reveals, then the rest of the page — a staged reveal, not everything appearing at once.

- Scroll-triggered reveals on every major section (fade + slight upward translate as sections enter viewport), staggered for grids of cards.

- Project image hover: subtle zoom on the image PLUS a metadata reveal overlay (project name, location, year) — not just a plain zoom.

- Nav links: color transition on hover/click (accent color underline or text-color shift), smooth, no abrupt state change.

- Sticky header behavior: header starts full-height/transparent over the hero; on scroll down it compresses into a shorter sticky bar with a background color and a reduced nav set (logo, Work, Services, Start a Project CTA only).

- A persistent "Start a Project" CTA that follows the visitor (sticky button, bottom corner or sticky bar) as they scroll the homepage.

- Smooth section-to-section transitions, no jump-cuts.

- Micro-interactions on all buttons and form fields (hover state, focus state, subtle press feedback).

- Logo strip / trust strip: continuous slow horizontal loop marquee, pausable on hover.

Explicitly AVOID: spinning logos, heavy 3D, neon effects, constant/looping text movement, slow animations that delay content access, anything that hurts mobile performance. Keep it cinematic and architectural, not "tech demo."

GLOBAL HEADER (appears site-wide)

Logo on the left, primary nav items, "Start a Project" styled as a solid button (not a plain link) on the right. Mega-menu style single-level dropdowns on hover/click for: Services (single page, no dropdown), Work (sub-tabs: Gym Projects / Fitness Studios / future), Resources (sub-tabs: Blog / Downloads), Partners (sub-tabs: Client Partners / Brand Partners — these scroll to sections, don't navigate), Company (sub-tabs: About Us / Careers / Contact Us). Sticky-compressed version on scroll as described above.

GLOBAL FOOTER

Quick links (Services, Work, Resources, Partners, Company, Start a Project), contact block (WhatsApp, email, Instagram, LinkedIn), a condensed Instagram feed strip, legal links (Privacy, Terms, FAQ), copyright line.

BUILD THE HOMEPAGE with these sections in this exact order:

00 — Promotional banner (thin top bar): rotating single line promoting latest blog/project/download with a link — dismissible.

01 — Hero: full-screen real gym project image/video background. Small category label "GYM INTERIOR DESIGN". Large headline "GYMS, DESIGNED TO PERFORM." (or "GYM INTERIOR DESIGN, DONE DIFFERENTLY."). Supporting line: "Specialised interior design for gyms and fitness spaces — built around function, performance and the people who use them." Primary CTA button "START YOUR GYM PROJECT", secondary text link "VIEW OUR WORK". Small proof line: "SPECIALISED GYM INTERIORS | 15+ PROJECTS". Staged text-then-image reveal animation as described above.

02 — Trust strip: condensed "worked with" logo marquee, looping, linking conceptually to a fuller Partners page.

03 — Selected Work: 3–5 strongest projects as cards (image/video, project name, location, category). On hover: zoom + reveal area/year + a one-line functional insight (never just a caption — e.g. "Zoned circulation cut equipment wait-time in half"). Include a "See more work" link to the Work listing page.

04 — Why Gym Interiors: explain that a gym needs equipment logic, circulation, durability and business thinking — not just aesthetics. This is the differentiation section — make the copy confident and specific, not generic ("we design beautiful gyms" is explicitly banned language).

05 — The Sagrika Approach + About: show the process as a horizontal/animated step sequence — Understand → Research → Plan → Design → Build → Learn — alongside a founder introduction framing Sagrika as a category expert (not just "the designer"). Include a short real founder-story line: architecture considered → chose interior design → started on Instagram as a portfolio in 2018 → residential to commercial → first gym project via referral → word-of-mouth built the specialisation.

06 — Case Study Spotlight: one gym project told as a real story arc — challenge → thinking → decisions → outcome — with a link into the full Project Detail page.

07 — Awards & Recognition: show the 3 real awards/recognitions as a clean credibility strip (do not pad with placeholders beyond what's real).

09 — Enquiry CTA: a short qualifying form (Name, Phone, Email, City) with one testimonial line placed beside it as a trust cue right next to the form.

10 — Mid-scroll popup: a popup that appears once during a scroll session, prompting the visitor to submit an enquiry — dismissible, not shown twice per session.

Use realistic placeholder gym/fitness interior stock imagery for now (clearly marked as placeholder), dummy project names/locations, and the exact headline/CTA language given above where specified. Build fully responsive, mobile-first. Use Google Sheets as the destination for form submissions (or a clearly marked mock submission handler for now, since the real Sheet/CRM integration will be wired up separately).

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gym-space-craft.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f49442db-09bc-43d8-99ba-ece5b159df71).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
