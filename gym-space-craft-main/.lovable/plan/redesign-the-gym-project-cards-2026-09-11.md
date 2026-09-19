# Redesign the gym project cards

## What will change
- Replace the homepage and Work-page project cards with one reusable editorial `ProjectCard`.
- Keep the existing Archivo/Hind typography, hierarchy, capitalization, spacing, and orange accent unchanged.
- Use a three-column desktop grid, two columns on tablet, and one spacious column on mobile.

## Card experience
- Give every card a large, consistently proportioned image area, thin border, square/subtle corners, and compact information area.
- Keep the project number at the image’s top-left and a circular case-study arrow at the top-right.
- Add restrained card lift, image zoom, dark overlay, arrow movement, and secondary information reveal on hover or keyboard focus.
- Show category, project name, location, area, year, and the existing functional insight without relying on hover for essential metadata.
- Link the complete card to its real `/work/{slug}` case-study page.

## Multi-image controls
- Build image arrays dynamically from each project’s card, gallery, hero, and available plan imagery.
- Add active-slide bars, previous/next controls on desktop, and touch swipe on mobile.
- Keep controls keyboard accessible, label them for assistive technology, and stop their clicks from opening the project.
- Respect reduced-motion preferences and avoid autoplay or aggressive animation.

## Technical details
- Add a shared project-card data shape that supports `number`, `category`, `title/name`, `location`, `area`, `year`, `images`, `insight`, and `slug`.
- Keep `ProjectShowcase` as a reusable grid wrapper around the shared card rather than a separate visual implementation.
- Update homepage project entries with their existing slugs, then reuse full project records on the Work page.
- Verify desktop, tablet/mobile layout, card navigation, image controls, swipe behavior, focus states, and the final build.
