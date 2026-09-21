import p1 from "@/assets/project-1.jpg";
import p2 from "@/assets/project-2.jpg";
import p3 from "@/assets/project-3.jpg";
import p4 from "@/assets/project-4.jpg";
import p5 from "@/assets/project-5.jpg";
import p6 from "@/assets/project-6.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import caseImg from "@/assets/case-study.jpg";
import floorplan from "@/assets/floorplan.jpg";
import heroGym from "@/assets/hero-gym.jpg";

/**
 * Add a new category by adding it here — the Work listing tabs and the
 * project cards read from this list, so no restructuring is needed.
 */
export const categories = ["Gym Projects", "Fitness Studios"] as const;
export type Category = (typeof categories)[number];

export type Project = {
  slug: string;
  name: string;
  location: string;
  category: Category;
  area: string;
  year: string;
  clientType: string;
  cardLabel?: string;
  hideCardMeta?: boolean;
  insight: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoCanonical?: string;
  card: string;
  cardImages?: string[];
  hero: string;
  gallery: { src: string; alt: string; caption?: string }[];
  plan?: { src: string; alt: string; caption: string };
  study: { brief: string; user: string; challenge: string; decisions: string; outcome: string; learning: string };
  testimonial: { quote: string; author: string; role: string };
  detail?: {
    title?: string;
    visualIntro?: string;
    visualHeadline?: string;
    planHeadline?: string;
    planTags?: string;
    ctaTitle?: string;
    ctaBody?: string;
    cta?: string;
    heroMeta?: { k: string; v: string }[];
    outcomes?: { k: string; v: string }[];
  };
};

const discussCta = {
  ctaTitle: "Have a space like this in mind?",
  ctaBody:
    "Tell us your floor area, location and what you want to build. We can explore how the space can be planned around your training needs.",
  cta: "Discuss your space",
} as const;

export const projects: Project[] = [
  {
    slug: "iron-standard",
    name: "THE STRENGTH CULTURE",
    location: "Jammu (J&K), India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "2024",
    clientType: "STRENGTH TRAINING GYM",
    insight:
      "A strength-focused gym designed around clear circulation, equipment flow and focused training.",
    card: p1,
    hero: heroGym,
    gallery: [
      { src: gallery1, alt: "Placeholder: barbell storage against micro-cement wall at Iron Standard", caption: "Loading zones sized for two lifters, not one." },
      { src: caseImg, alt: "Placeholder: main training floor at Iron Standard", caption: "The strength floor reads as one room, but runs as four zones." },
    ],
    plan: {
      src: floorplan,
      alt: "Placeholder zoning diagram: circulation spine through the Iron Standard floor",
      caption:
        "The floor was designed for strength training, with circulation paths and equipment clearances worked out before the visual direction was established.",
    },
    study: {
      brief: "The client wanted a space dedicated to strength training only, with the feel of a temple for a bodybuilder.",
      user:
        "The space was designed for people focused on strength training, with the workout experience kept at the centre of the design.",
      challenge:
        "The first gym project, so it was a challenge working out the right circulation routes and equipment clearances to make the space function.",
      decisions:
        "The gym was in a basement, not much light, so instead of fighting that, we embraced it with an all-black interior that created focus and reduced distractions.",
      outcome:
        "The focused design created a distinctive gym identity where training became the priority rather than creating spaces around the usual selfie culture.",
      learning:
        "This project taught us restraint: how to curate a space without overdoing it, keeping the design minimal, elegant and focused.",
    },
    detail: {
      title: "THE STRENGTH CULTURE- Jammu(j&k), India",
      visualIntro:
        "A visual walkthrough of the planning, material choices and design decisions behind the space.",
      visualHeadline: "Built around the workout",
      planHeadline: "The layout that made space work",
      planTags: "Circulation · Equipment · Clearance",
      ctaTitle: "Have a space like this in mind?",
      ctaBody:
        "Tell us your floor area, location and what you want to build. We can explore how the space can be planned around your training needs.",
      outcomes: [
        { k: "Location", v: "Jammu (J&K), India" },
        { k: "Completed", v: "2024" },
        { k: "Project type", v: "STRENGTH TRAINING GYM" },
      ],
    },
    testimonial: {
      quote:
        "We had a bucket of ideas and Sagrika helped us turn it into something much bigger than we ever thought possible.",
      author: "Arushi Kajaria",
      role: "The Strength Culture",
    },
  },
  {
    slug: "sanctum-wellness",
    name: "A3 FITNESS GYM & SPA",
    location: "Jammu, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "3,500 sq ft",
    year: "",
    clientType: "LIFESTYLE-FOCUSED FITNESS SPACE",
    insight:
      "A lifestyle-focused fitness space where multiple training zones come together in 3,500 sq ft.",
    card: p2,
    hero: p2,
    gallery: [
      { src: p5, alt: "Placeholder: calm studio room with warm oak floor at Sanctum Wellness", caption: "The quiet room sits furthest from the entry, not nearest the window." },
      { src: gallery1, alt: "Placeholder: material study at Sanctum Wellness" },
    ],
    plan: {
      src: floorplan,
      alt: "Zoning diagram for A3 Fitness Gym & Spa",
      caption:
        "The floor was designed to accommodate a wide range of training functions using ceiling and floor modifications to define zones without the use of partitions.",
    },
    study: {
      brief: "The client wanted a unique fitness space for lifestyle users, designed to become an attraction for a young audience.",
      user:
        "The space needed to bring together different activities while creating an experience that appealed to a younger, lifestyle-focused audience.",
      challenge:
        "The challenge was fitting cardio, Zumba, dumbbells and strength training into 3,500 sq ft without making the space feel divided.",
      decisions:
        "We used the ceiling and flooring as visual demarcation instead of adding partitions. We combined Cardio and Zumba because they could share the same lighting and music conditions.",
      outcome:
        "The design was very well received and responded to and the client eventually had to move to larger premises because of the demand.",
      learning:
        "The project showed us how different elements, when planned in harmony, can create a space that flows seamlessly.",
    },
    detail: {
      title: "A3 FITNESS GYM & SPA · Jammu, India",
      heroMeta: [],
      visualIntro: "A visual walkthrough of the planning, zoning and design decisions behind the space.",
      visualHeadline: "Zoned without closing the space",
      planHeadline: "The layout that made 3,500 sq ft work",
      planTags: "Cardio · Zumba · Strength · Flow",
      ...discussCta,
      outcomes: [
        { k: "Footprint", v: "3,500 sq ft" },
        { k: "Location", v: "Jammu, India" },
        { k: "Project type", v: "LIFESTYLE-FOCUSED FITNESS SPACE" },
      ],
    },
    testimonial: {
      quote: "The best interior designer I have come across. She designed my gym, A3 Fitness, well beyond my expectations. Kudos to her.",
      author: "Aastik Khajuria",
      role: "A3 Gym",
    },
  },
  {
    slug: "north-block-strength",
    name: "FIT FIRST GYM",
    location: "Rajkot, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "FITNESS ARENA",
    insight:
      "A spacious fitness arena designed remotely from Delhi, with careful planning across multiple training zones.",
    card: p6,
    hero: p6,
    gallery: [{ src: gallery1, alt: "Placeholder: interior detail at North Block Strength" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Fit First Gym",
      caption:
        "The planning used the large floor area and volume to create openness while keeping functional requirements for each zone in place.",
    },
    study: {
      brief:
        "The client already had a gym and wanted to create a newer, better and bigger version of it, with a fitness arena where people could perform.",
      user: "The space needed to support members at a much larger scale while creating the feeling of a spacious fitness arena.",
      challenge:
        "The project was large in scale and had to be designed remotely from Delhi while working with an execution team in Rajkot.",
      decisions:
        "We used the large floor area and volume to create a sense of vastness. Instead of visually dividing the gym with partitions, the few partitions used were carefully designed to allow light flow while supporting different music and HVAC requirements.",
      outcome:
        "Constant coordination and clear drawings helped translate the design remotely, resulting in a space that matched the original design vision.",
      learning:
        "The project taught us the importance of better communication systems and drawings that work as clear tools between the design and execution teams.",
    },
    detail: {
      title: "FIT FIRST GYM · Rajkot, India",
      heroMeta: [],
      visualIntro:
        "A visual walkthrough of the planning, remote coordination and spatial decisions that went into the fitness arena.",
      visualHeadline: "Designed to feel vast",
      planHeadline: "Making scale work for the space",
      planTags: "Scale · Light · HVAC · Zoning",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Rajkot, India" },
        { k: "Project type", v: "FITNESS ARENA" },
      ],
    },
    testimonial: {
      quote: "Despite managing the project remotely, Sagrika made the process smooth and delivered the bigger gym we wanted.",
      author: "OWNER",
      role: "FIT FIRST GYM",
    },
  },
  {
    slug: "rep-house-cycle",
    name: "THE BODY MOVE FITNESS",
    location: "New Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "CLUB-BASED FITNESS SPACE",
    insight:
      "A nature-inspired fitness space that brings natural materials, organic forms and greenery into the gym experience.",
    card: p4,
    hero: p4,
    gallery: [
      { src: p5, alt: "Placeholder: studio interior at Rep House Cycle" },
      { src: gallery1, alt: "Placeholder: material detail at Rep House Cycle" },
    ],
    plan: {
      src: floorplan,
      alt: "Planning diagram for The Body Move Fitness",
      caption:
        "The design had to work with existing electrical and plumbing conditions while creating a natural connection between the gym and its surroundings.",
    },
    study: {
      brief:
        "The client wanted a fitness space for a club with an all-age audience. The only clear direction was simple: it had to be a non-black gym.",
      user:
        "The space needed to work for people across different age groups while fitting naturally into the wider club environment.",
      challenge:
        "The existing electrical panel had to remain intact, the washrooms had to follow existing plumbing and the gym needed to connect visually with the green cricket ground and garden outside.",
      decisions:
        "We have moved away from the typical dark gym language and taken cues from nature, with wood, stone, limewash textures, PU stone, organic forms and natural light.",
      outcome:
        "The space developed a completely different identity from the typical dark gym, while connecting the interior with the natural surroundings of the club.",
      learning: "The project required us to work through thematic design and to solve a number of technical problems on site.",
    },
    detail: {
      title: "THE BODY MOVE FITNESS",
      heroMeta: [],
      visualIntro:
        "A visual walkthrough into how natural materials, existing constraints and surrounding landscape informed the design.",
      visualHeadline: "A gym inspired by nature",
      planHeadline: "Planning around what already exists",
      planTags: "Existing services · Natural light · Organic flow",
      ...discussCta,
      outcomes: [{ k: "Project type", v: "CLUB-BASED FITNESS SPACE" }],
    },
    testimonial: {
      quote: "Sagrika was there for every detail from beginning to end and made sure everything was done right.",
      author: "OWNER",
      role: "The Body Move Fitness",
    },
  },
  {
    slug: "forge-24",
    name: "A3 FITNESS GYM 2",
    location: "",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "EXPANDED FITNESS GYM",
    insight:
      "A former car garage transformed into a premium fitness space through smart zoning, ceilings and lighting.",
    card: p3,
    hero: p3,
    gallery: [
      { src: p6, alt: "Placeholder: turf sled lane at Forge 24", caption: "The sled lane runs parallel to circulation, never across it." },
      { src: caseImg, alt: "Placeholder: main floor at Forge 24" },
    ],
    plan: {
      src: floorplan,
      alt: "Planning diagram for A3 Fitness Gym 2",
      caption:
        "The layout and ceiling strategy helped break down the oversized space into functional zones while keeping the design efficient to execute.",
    },
    study: {
      brief:
        "Reuse of existing mirrors extended up to the walls. Different lighting and ceiling treatments were introduced for each zone. Sectional ceilings were used to control cost and speed up execution.",
      user: "The space needed to carry forward the experience of the previous gym while working at a much larger scale.",
      challenge:
        "The space had previously been a car garage with a huge ceiling. The challenge was to make it feel premium rather than like a garage or warehouse-style gym, while working within a tight timeline.",
      decisions:
        "Existing mirrors were reused and extended across the walls. Different lighting and ceiling treatments were introduced for each zone, while sectional ceilings helped control cost and speed up execution.",
      outcome:
        "The design was able to turn an awkward, oversized shell into a more thoughtful environment for the gym while cleverly using existing elements.",
      learning:
        "The project showed us how existing elements, technical challenges and time constraints can become opportunities for creative problem-solving.",
    },
    detail: {
      title: "A3 FITNESS GYM 2",
      heroMeta: [],
      visualIntro: "A visual journey from existing elements and a challenging shell to a cohesive fitness space.",
      visualHeadline: "From garage to gym",
      planHeadline: "Making a large space feel intentional",
      planTags: "Zoning · Lighting · Ceiling · Reuse",
      ...discussCta,
      outcomes: [{ k: "Project type", v: "EXPANDED FITNESS GYM" }],
    },
    testimonial: {
      quote: "Sagrika made our existing elements work beautifully and transformed the old garage-like space into a premium gym.",
      author: "OWNER",
      role: "A3 FITNESS GYM 2",
    },
  },
  {
    slug: "still-house-recovery",
    name: "DAWN'S GYM",
    location: "Amritsar, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "LUXURY MULTI-FLOOR GYM",
    insight:
      "A multi-floor luxury gym designed around strength, CrossFit, women’s training and hospitality.",
    card: p5,
    hero: p5,
    gallery: [{ src: p2, alt: "Placeholder: recovery room at Still House" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Dawn's Gym",
      caption:
        "The design language was planned to connect the different floors while allowing each training environment to remain distinct.",
    },
    study: {
      brief:
        "The client wanted to create a luxury gym with separate spaces for women, strength training and CrossFit, along with reception and cafeteria areas.",
      user: "The gym had to accommodate a variety of training audiences and activities on several floors.",
      challenge:
        "The challenge was coordinating multiple floors and activities while the project also went through a temporary halt and changing priorities.",
      decisions:
        "We carried one design language across the floors, building on the dark gym concept while introducing different elements to distinguish each floor.",
      outcome:
        "The project brought multiple training and hospitality functions together while allowing each floor to have its own character within the larger gym.",
      learning:
        "The project taught us that an initial idea can evolve into better ones as constraints and priorities change during the design process.",
    },
    detail: {
      title: "DAWN'S GYM · Amritsar, India",
      heroMeta: [],
      visualIntro:
        "A visual walkthrough of the planning and design language developed across multiple floors and training functions.",
      visualHeadline: "One gym, multiple experiences",
      planHeadline: "Planning across multiple floors",
      planTags: "Strength · CrossFit · Women's · Hospitality",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Amritsar, India" },
        { k: "Project type", v: "LUXURY MULTI-FLOOR GYM" },
      ],
    },
    testimonial: {
      quote: "Sagrika brought different training areas across multiple floors together and gave the entire gym a uniform look.",
      author: "OWNER",
      role: "DAWN'S GYM",
    },
  },
  {
    slug: "fitness-manzil-gym",
    name: "FITNESS MANZIL GYM",
    location: "South Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "PREMIUM FITNESS GYM",
    insight:
      "A premium basement gym planned around limited natural light, with dedicated cardio and studio training spaces.",
    card: caseImg,
    hero: caseImg,
    gallery: [
      { src: p1, alt: "Fitness Manzil Gym basement training floor" },
      { src: gallery1, alt: "Fitness Manzil Gym cardio and studio daylight zoning" },
    ],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Fitness Manzil Gym",
      caption:
        "The layout was organised to make the most of the available natural light while accommodating cardio, studio training and existing plumbing restrictions.",
    },
    study: {
      brief: "The client wanted a premium space that could raise the standard of the gym and strengthen the brand experience.",
      user:
        "The space needed to support both cardio and studio training while creating areas that people would naturally want to photograph and share.",
      challenge:
        "The gym was in a basement with almost no natural light. Existing washroom and plumbing conditions in a multi-storey building also created several restrictions.",
      decisions:
        "The space has been designed to bring the available natural light toward the cardio and studio zones using light walls and flooring to maximize it. Recognizable design elements were also added to create content friendly spots without relying directly on logos.",
      outcome:
        "The space combined premium positioning with a stronger visual identity, creating recognisable areas that could translate into social media content.",
      learning:
        "The project showed us how careful planning and bringing the right consultants on board can simplify a complicated site.",
    },
    detail: {
      title: "FITNESS MANZIL GYM",
      heroMeta: [],
      visualIntro: "A visual walkthrough of the planning, light strategy and brand-focused details behind the space.",
      visualHeadline: "Making light work harder",
      planHeadline: "Planning around limited light",
      planTags: "Natural light · Cardio · Studio · Services",
      ...discussCta,
      outcomes: [{ k: "Project type", v: "PREMIUM FITNESS GYM" }],
    },
    testimonial: {
      quote: "Sagrika used our basement space to its full potential and created a premium gym that feels memorable.",
      author: "OWNER",
      role: "FITNESS MANZIL GYM",
    },
  },
  {
    slug: "outwork-fitness-gym",
    name: "OUTWORK FITNESS GYM",
    location: "South Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "TWO-FLOOR FITNESS GYM",
    insight:
      "A two-floor fitness space with contrasting interiors designed for different training audiences.",
    card: p4,
    hero: p4,
    gallery: [
      { src: p6, alt: "Outwork Fitness Gym two-floor training layout" },
      { src: p3, alt: "Outwork Fitness Gym circulation around structural constraints" },
    ],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Outwork Fitness Gym",
      caption:
        "The discovery of major structural elements during demolition required the layout to be completely reworked around the actual site conditions.",
    },
    study: {
      brief:
        "The client wanted a fitness space that could attract both bodybuilders and Zumba users, using two floors to separate the two use cases.",
      user:
        "The two floors needed to support different training audiences while giving each use case a space that felt appropriate to it.",
      challenge:
        "The project combined two shops on consecutive plots. During demolition, large structural elements were discovered, forcing the entire layout to be reworked.",
      decisions:
        "We gave each floor its own character. One was kept light, airy and natural, while the other took a darker, moodier direction. We also brought the client’s logo into the interiors to give the space a stronger brand identity.",
      outcome:
        "The two-floor concept gave the different training audiences distinct environments while using contrast to create a stronger overall gym identity.",
      learning:
        "This project taught us to stay flexible. When the site threw unexpected structural challenges at us, we had to rethink the layout and make the new constraints work for the design.",
    },
    detail: {
      title: "OUTWORK FITNESS GYM",
      heroMeta: [],
      visualIntro:
        "A visual walkthrough of the site constraints, contrasting floor concepts and brand decisions behind the space.",
      visualHeadline: "Two floors, two training worlds",
      planHeadline: "When the site changes the plan",
      planTags: "Structure · Replanning · Two floors · Zoning",
      ...discussCta,
      outcomes: [{ k: "Project type", v: "TWO-FLOOR FITNESS GYM" }],
    },
    testimonial: {
      quote: "Sagrika understood the different look we wanted and created a space we are truly pleased with.",
      author: "OWNER",
      role: "OUTWORK FITNESS GYM",
    },
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export const projectFaqs = [
  {
    q: "01. What types of projects do you work on?",
    a: "We specialise in gym and fitness interior design, with experience across different types and scales of fitness spaces.",
  },
  {
    q: "02. Can I see the thinking behind your projects?",
    a: "Yes. Selected project case studies explain the brief, users, constraints, design decisions, results and learnings behind the space.",
  },
  {
    q: "03. What is your approach to gym interior design?",
    a: "Our approach is function-first. We consider movement, equipment placement, circulation, user experience and the practical requirements of the space before developing the visual direction.",
  },
  {
    q: "04. Can you work with an existing floor plan?",
    a: "Yes. An existing floor plan can be used as a starting point to understand the available space, requirements and possibilities for the project.",
  },
  {
    q: "05. What types of fitness spaces have you designed?",
    a: "Our work includes strength training gyms, lifestyle-focused fitness spaces, multi-floor gyms, fitness arenas and other fitness environments with different training and user requirements.",
  },
  {
    q: "06. Do your projects include technical drawings?",
    a: "Yes. Detailed 2D working drawings are part of the design scope and help translate the design into clear instructions for execution.",
  },
  {
    q: "07. Can I discuss a project similar to one shown here?",
    a: "Yes. If you are planning a similar gym or fitness space, you can share your project details through the Start a Project page.",
  },
];
