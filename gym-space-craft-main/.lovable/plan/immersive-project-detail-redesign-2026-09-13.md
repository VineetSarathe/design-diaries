# Immersive Project Detail Redesign

## Goal
Turn every project detail page into a richer visual case study that feels premium, architectural, and consistent with the homepage, while preserving all existing project facts, copy, imagery, links, and typography.

## What will change
- Recompose the opening into a cinematic project introduction with stronger image framing, compact project facts, and clearer navigation back to all work.
- Replace the current long question-row presentation with a more visual six-stage case-study journey. Each stage will pair its text with relevant project imagery, numbered markers, and clear dark/light pacing.
- Add an editorial image mosaic using the project hero, card image, gallery, and floor-plan assets, with captions and restrained hover zoom.
- Turn the zoning study into a focused interactive visual moment with animated annotations and a clearer connection to the design decision.
- Add a compact outcomes rail that makes the project’s key result, area, year, and client type easier to scan.
- Restyle the testimonial, related projects, enquiry prompt, and FAQ so the lower page continues the immersive visual rhythm instead of reverting to ordinary stacked sections.
- Add viewport-entry reveals, subtle parallax, image crossfades, progress details, and tactile hover states, while respecting reduced-motion settings.

## Responsive behavior
- Desktop uses asymmetric editorial grids and controlled sticky storytelling.
- Tablet keeps the visual hierarchy while reducing overlap and image density.
- Mobile becomes a single, readable visual journey with compact images, swipe-safe galleries, centered facts, and no horizontal overflow.

## Technical details
- Reuse the existing project data model and local assets; no invented projects, claims, or routes.
- Build small reusable project-detail presentation components rather than duplicating markup.
- Keep the existing semantic color tokens, Archivo/Hind typography, Instrument Serif accents, and orange highlight system.
- Preserve route metadata, accessibility labels, keyboard focus states, lazy loading, and reduced-motion support.
- Verify all project routes on desktop and mobile, including image loading, interactions, overflow, console errors, and the final build.
