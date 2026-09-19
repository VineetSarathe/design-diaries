import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "downloads");

const ink = rgb(0.12, 0.11, 0.1);
const muted = rgb(0.38, 0.36, 0.34);
const rust = rgb(0.72, 0.35, 0.22);
const rule = rgb(0.82, 0.8, 0.76);

const guides = [
  {
    file: "first-time-gym-owners-planning-checklist.pdf",
    title: "A First-Time Gym Owner's Planning Checklist",
    kicker: "Design Diaries  ·  PDF checklist  ·  6 sections",
    intro:
      "Work through these checks before you commit to a gym space — from the lease and the building to circulation, services and the training programme.",
    sections: [
      {
        heading: "01  Before signing the lease",
        items: [
          "Confirm permitted use covers a commercial gym, not only 'retail' or 'office'.",
          "Record clear floor-to-soffit height at the lowest beam, duct and sprinkler.",
          "Note column grid, shear walls and any core that will split the floor.",
          "Ask who pays for extra electrical load, water and drainage if the unit cannot take a gym as-is.",
          "Walk the entry, lift and stair with a loaded equipment crate in mind.",
        ],
      },
      {
        heading: "02  Check the building",
        items: [
          "Measure the real usable rectangle after fire stairs, toilets and landlord plant.",
          "Check slab capacity for heavy racks, plate trees and dense free-weight zones.",
          "Map existing wet areas — toilets, showers, mop sinks — before you draw lockers.",
          "Find the electrical room and confirm spare capacity with the building engineer.",
          "Stand outside at the time of day members will arrive. Noise, light and drop-off all count.",
        ],
      },
      {
        heading: "03  Think about circulation",
        items: [
          "Draw one clear spine from reception to the furthest training zone. Do not cross it with racks.",
          "Keep a path that a stretcher or service trolley can use without moving equipment.",
          "Separate the queue at reception from people walking to the floor.",
          "Give turf, sleds and carry lanes a long, unbroken run — never across the main aisle.",
          "Check sightlines from the trainer desk to the free-weight floor and the studio door.",
        ],
      },
      {
        heading: "04  Services",
        items: [
          "HVAC: a packed floor at 7am needs more air than an empty shell suggests.",
          "Power: racks with screens, cardio banks and a front desk all pull from different circuits.",
          "Water: showers, drinking points and mop sinks should sit on the wet side of the plan.",
          "Drainage falls and grease / hair traps if you are adding a juice bar or treatment room.",
          "Data and CCTV routes so you are not chasing conduits after the floor is down.",
        ],
      },
      {
        heading: "05  Test the gym programme",
        items: [
          "List every activity the space must hold at peak: strength, cardio, classes, recovery, retail.",
          "Write the busiest hour. If two programmes clash, the layout will fail first.",
          "Count stations, not just square feet. A 3,000 sq ft floor can still be one programme short.",
          "Decide what can share a zone and what must never share (e.g. Olympic lifting and a cycle class).",
          "Leave a holding area for the next class so the floor does not become a waiting room.",
        ],
      },
      {
        heading: "06  Fit-out and equipment sequence",
        items: [
          "Do not order equipment until the circulation spine and wet rooms are fixed on plan.",
          "Phase year-one equipment vs year-two so the first fit-out is not over-stuffed.",
          "Specify flooring by zone: shock, hygiene, and what members see from the door.",
          "Set a contingency for slab, power and acoustic work the survey will miss.",
          "Walk the drawings with your operator before you freeze the tender set.",
        ],
      },
    ],
  },
  {
    file: "equipment-layout-and-circulation-guide.pdf",
    title: "Gym Equipment Layout & Circulation Guide",
    kicker: "Design Diaries  ·  PDF guide  ·  7 sections",
    intro:
      "A practical guide to equipment clearances, circulation and zoning before the workout floor is finalised.",
    sections: [
      {
        heading: "01  Start with the zones",
        items: [
          "List every programme the floor must hold at peak: strength, cardio, classes, recovery, stretch.",
          "Give each programme a rectangle on plan before you place a single rack.",
          "Keep noisy, high-impact work away from the front desk and any quiet / recovery room.",
          "Put the most used zone where people land after changing — not at the far corner.",
          "Decide what can share a bay and what must never share (Olympic lifting vs a cycle class).",
        ],
      },
      {
        heading: "02  Equipment clearances",
        items: [
          "Power rack: leave a loaded-bar path behind the lifter and a walk-past on at least one side.",
          "Bench pairs: keep enough gap that two users can rerack without touching.",
          "Selectorised machines: allow the stack to be loaded and the user to stand up without blocking the aisle.",
          "Dumbbell run: a clear lift-off strip in front of the rack, not into the circulation spine.",
          "Cardio banks: service access behind screens, and a way out that does not cross a squat bay.",
        ],
      },
      {
        heading: "03  Build a circulation spine",
        items: [
          "Draw one primary spine from reception to the furthest training zone. Equipment does not sit on it.",
          "Keep it wide enough for two people to pass with a gym bag, including at peak hour.",
          "Do not let the spine die into a dead end of machines.",
          "Give a second service route for staff, stretchers and trolley access.",
          "Separate the welcome queue from people walking onto the floor.",
        ],
      },
      {
        heading: "04  Place turf, sleds and functional zones",
        items: [
          "Turf and sled lanes need a long, unbroken run. Never cut them across the main aisle.",
          "Keep throw / slam / battle-rope work inside the functional bay, not in the spine.",
          "Anchor sleds and wall-balls where they cannot clip a passer-by.",
          "If the lane is shared with stretching, timetable it. Layout cannot fix a clash you ignore.",
          "Store sleds, prowlers and bags off the run so the lane stays clear between sets.",
        ],
      },
      {
        heading: "05  Sightlines and trainer positions",
        items: [
          "From the trainer desk you should see the free-weight floor and the studio door.",
          "Mirrors help coaching, but glare from west light can wipe a wall at 5pm. Test it.",
          "Unstaffed hours still need a camera or a sightline to the entry, not a maze of racks.",
          "Do not hide the stretcher path behind a solid bank of cardio.",
          "Place the water point where a coach can still see the floor.",
        ],
      },
      {
        heading: "06  Peak-hour testing",
        items: [
          "Walk the plan at the busiest hour you expect, not at 11am on a Tuesday.",
          "If two classes change over, the holding space cannot spill onto the spine.",
          "Count stations, not only square feet. A full floor can still be one programme short.",
          "Watch bag drop, towel bins and bottle fillers — they become bottlenecks first.",
          "If a route only works when the gym is empty, redraw it.",
        ],
      },
      {
        heading: "07  Flooring and adjacency",
        items: [
          "Change flooring with the zone so members read the plan with their feet.",
          "Heavy lifting wants shock and a stable plate; turf wants a different build-up.",
          "Keep wet-adjacent finishes off the free-weight floor.",
          "Put plate trees and dumbbells where they are used, not where they look neat on a moodboard.",
          "Freeze the layout before you order equipment. Clearances are cheaper on paper.",
        ],
      },
    ],
  },
];

function wrap(text, font, size, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function buildPdf(doc) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const pageSize = [595.28, 841.89];
  const margin = 54;
  const maxWidth = pageSize[0] - margin * 2;
  let page = pdf.addPage(pageSize);
  let y = pageSize[1] - 56;

  const ensure = (need) => {
    if (y - need < 56) {
      page = pdf.addPage(pageSize);
      y = pageSize[1] - 56;
    }
  };

  const draw = (text, f, size, color) => {
    const lines = wrap(text, f, size, maxWidth);
    for (const line of lines) {
      ensure(size + 6);
      page.drawText(line, { x: margin, y, size, font: f, color });
      y -= size + 5;
    }
  };

  page.drawRectangle({
    x: 0,
    y: pageSize[1] - 8,
    width: pageSize[0],
    height: 8,
    color: rust,
  });

  draw(doc.kicker.toUpperCase(), bold, 8, rust);
  y -= 10;
  draw(doc.title.toUpperCase(), bold, 18, ink);
  y -= 8;
  draw(doc.intro, font, 11, muted);
  y -= 14;
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize[0] - margin, y },
    thickness: 0.6,
    color: rule,
  });
  y -= 22;

  for (const section of doc.sections) {
    ensure(48);
    draw(section.heading.toUpperCase(), bold, 11, ink);
    y -= 4;
    for (const item of section.items) {
      const lines = wrap(item, font, 10, maxWidth - 18);
      ensure(lines.length * 14 + 8);
      page.drawText("[ ]", { x: margin, y, size: 10, font, color: rust });
      for (const line of lines) {
        page.drawText(line, { x: margin + 22, y, size: 10, font, color: ink });
        y -= 14;
      }
      y -= 4;
    }
    y -= 10;
  }

  ensure(36);
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageSize[0] - margin, y },
    thickness: 0.6,
    color: rule,
  });
  y -= 16;
  draw("Design Diaries by Sagrika  ·  Gym and fitness interior specialists", font, 9, muted);
  draw("designdiaries.in", font, 9, rust);

  return pdf.save();
}

await mkdir(outDir, { recursive: true });
for (const guide of guides) {
  const bytes = await buildPdf(guide);
  const dest = path.join(outDir, guide.file);
  await writeFile(dest, bytes);
  console.log(`wrote ${dest}`);
}
