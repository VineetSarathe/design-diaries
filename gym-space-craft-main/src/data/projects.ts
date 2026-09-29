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
  {
    slug: "q3-fitness-rohini",
    name: "Q3 FITNESS",
    location: "Rohini, Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "COMMUNITY FITNESS GYM",
    insight:
      "A community-focused gym bringing its red and black identity into a balanced, functional interior.",
    card: p1,
    hero: p1,
    gallery: [{ src: gallery1, alt: "Q3 Fitness Rohini training floor" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Q3 Fitness",
      caption:
        "The layout had to account for equipment placement, mirrors and the limited number of usable walls before the visual identity could be brought into the space.",
    },
    study: {
      brief:
        "The client wanted to create a gym that could be loved by a wide audience while building on the existing Q3 Fitness brand identity. Red and black were already an important part of the brand, so the interior needed to carry those colours into the space.",
      user:
        "The goal was to create a community-based fitness environment that felt welcoming to different users. The space needed to have the energy of the brand without becoming visually overwhelming for the people using it every day.",
      challenge:
        "The biggest challenge was the bright red colour the client strongly wanted to use. The site also had a large facade with only two walls available for design, making machine placement and mirror positioning particularly challenging.",
      decisions:
        "Instead of allowing red to dominate the interiors, we used it in smaller elements and allowed grey to become the stronger visual base. Equipment and mirrors were carefully positioned around the limited wall surfaces so that the functional requirements still worked with the design.",
      outcome:
        "The final interior maintained the recognisable character of the Q3 brand while creating a more balanced environment for training. The placement of machines and mirrors was carefully worked out so that the large facade did not become a limitation to the workout floor.",
      learning:
        "This project taught us how to work with a strong visual preference without allowing it to dictate every design decision. Sometimes the better solution is not to remove something challenging, but to find the right amount of it.",
    },
    detail: {
      title: "Q3 FITNESS · Rohini, Delhi, India",
      visualIntro:
        "A strong brand identity can be a great starting point, but bringing it into an interior takes balance. Q3 Fitness needed its red and black identity to remain recognisable while creating a space that still felt comfortable and functional.",
      visualHeadline: "Built around the brand, without being overpowered by it",
      planHeadline: "Making a strong brand palette work",
      planTags: "Equipment · Mirrors · Branding · Balance",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Rohini, Delhi, India" },
        { k: "Project type", v: "COMMUNITY FITNESS GYM" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "Q3 FITNESS" },
  },
  {
    slug: "vstrongr-studio-vasant-vihar",
    name: "VSTRONGR STUDIO",
    location: "Vasant Vihar, Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "PERSONAL TRAINING STUDIO",
    insight: "A personal training studio designed around movement, performance and recovery.",
    card: p2,
    hero: p2,
    gallery: [{ src: heroGym, alt: "VSTRONGR Studio training space" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for VSTRONGR Studio",
      caption:
        "The planning focused on creating a clear movement through the studio while working around the existing structural and site constraints.",
    },
    study: {
      brief:
        "The client wanted a personal training studio based around four pillars: learn to move, build, perform and recover. The brand already had a clear story and direction, so the design needed to translate that journey into the physical space.",
      user:
        "The studio was designed around a more focused personal training experience. Instead of creating a generic gym floor, the space needed to support a journey where users could learn, train, perform and eventually recover.",
      challenge:
        "The site was a basement with very limited natural light. The pillars were unevenly placed and there was no emergency exit. A new staircase also had to be excavated on site, making the existing conditions an important part of the design challenge.",
      decisions:
        "The idea of a fitness journey became part of the visual experience through a focus light running through the space. We kept the design minimal and concentrated on the training experience rather than adding unnecessary materials or decorative elements.",
      outcome:
        "The studio developed a more refined and focused atmosphere without relying on excessive finishes. A lighter colour palette helped create a luxurious mood, while the restrained material selection kept the space practical and durable.",
      learning:
        "This project reinforced the value of restraint in gym design. Using only tile and textured paint for the main material approach showed that a space can feel considered and premium without relying on too many materials.",
    },
    detail: {
      title: "VSTRONGR STUDIO · Vasant Vihar, Delhi, India",
      visualIntro:
        "VSTRONGR came with a strong idea of its own. The studio was built around a four-part fitness journey, giving the design a clear story to work with from the beginning.",
      visualHeadline: "A studio built around the fitness journey",
      planHeadline: "Turning a fitness journey into space",
      planTags: "Journey · Lighting · Training · Recovery",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Vasant Vihar, Delhi, India" },
        { k: "Project type", v: "PERSONAL TRAINING STUDIO" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "VSTRONGR STUDIO" },
  },
  {
    slug: "bharat-fitness-den-bhubaneswar",
    name: "BHARAT FITNESS DEN",
    location: "Bhubaneswar, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "LUXURY FITNESS & WELLNESS",
    insight: "A luxury fitness space where training, wellness and hospitality come together.",
    card: p3,
    hero: p3,
    gallery: [{ src: caseImg, alt: "Bharat Fitness Den interior" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Bharat Fitness Den",
      caption:
        "The planning had to bring training, wellness, hospitality and social spaces together while responding to the building's structural and safety constraints.",
    },
    study: {
      brief:
        "The client wanted to create a highly luxurious gym and gave the studio 50 days to develop the design. The brief was intentionally simple, leaving the design team to define what luxury would mean for the space.",
      user:
        "The project was planned as more than a traditional workout floor. It brought together training, food, wellness and social experiences so that different parts of the gym could serve different needs throughout the day.",
      challenge:
        "The building had a facade on three sides, fixed washroom positions and several fire-safety restrictions. The building construction also meant that its vibration-bearing capacity was low, adding another technical consideration to the design.",
      decisions:
        "We started with the layout and worked through the restrictions zone by zone. The café was designed around a contrast between healthy and treat food, while the reception, cardio, Zumba, spin, wellness and strength areas each received their own spatial character.",
      outcome:
        "Each area developed a distinct experience without making the gym feel like a collection of disconnected spaces. Ceilings, materials and lighting helped define the different zones while keeping the overall design language cohesive.",
      learning:
        "This project reinforced the importance of solving the plan before moving into the visual layer. When a site comes with multiple restrictions, working through each zone systematically makes the larger design much easier to control.",
    },
    detail: {
      title: "BHARAT FITNESS DEN · Bhubaneswar, India",
      visualIntro:
        "The brief was simple: create a luxurious gym. The complexity came from the building itself, with multiple restrictions that had to be resolved before the different experiences within the gym could come together.",
      visualHeadline: "Luxury, zone by zone",
      planHeadline: "A layout built around many experiences",
      planTags: "Cardio · Studios · Wellness · Hospitality",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Bhubaneswar, India" },
        { k: "Project type", v: "LUXURY FITNESS & WELLNESS" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "BHARAT FITNESS DEN" },
  },
  {
    slug: "the-fitness-matters-gym-ambajogai",
    name: "THE FITNESS MATTERS GYM",
    location: "Ambajogai, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "TRAINING GYM",
    insight: "A dark, atmospheric gym shaped by lighting, zoning and everyday training.",
    card: p4,
    hero: p4,
    gallery: [{ src: p5, alt: "The Fitness Matters Gym training floor" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for The Fitness Matters Gym",
      caption:
        "The layout and lighting work together to distinguish different exercise areas while keeping the overall gym visually connected.",
    },
    study: {
      brief:
        "This was the first project the studio took completely online. The client was confident that the project could be executed remotely, making it an important step in understanding how the studio could communicate a design without being physically present on site.",
      user:
        "The gym was designed around everyday training, with different exercise areas needing to feel clearly defined while still belonging to one overall environment.",
      challenge:
        "The biggest challenge was communication. There was a language barrier between the studio and the labour team, so multiple calls, drawings and visual references were needed to make sure the design was understood correctly.",
      decisions:
        "The space was developed as a dark den, with lighting used to identify different areas for different types of exercise. A café for healthy meals was also incorporated into the overall gym experience.",
      outcome:
        "Lighting became an important part of the way the gym was experienced, helping distinguish different training areas without relying heavily on physical partitions. The café added another layer to the everyday experience of the space.",
      learning:
        "The project showed us how important clear communication becomes when design and execution happen remotely. Drawings and references need to be simple enough for the people on site to understand and act on them.",
    },
    detail: {
      title: "THE FITNESS MATTERS GYM · Ambajogai, India",
      visualIntro:
        "This was the first project the studio took entirely online. The design had to travel through drawings, references and conversations before it could become a physical space on site.",
      visualHeadline: "A dark den for training",
      planHeadline: "Using light to define the floor",
      planTags: "Zoning · Lighting · Training · Café",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Ambajogai, India" },
        { k: "Project type", v: "TRAINING GYM" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "THE FITNESS MATTERS GYM" },
  },
  {
    slug: "uk-fitness-paschim-vihar",
    name: "UK FITNESS",
    location: "Paschim Vihar, Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "FITNESS GYM",
    insight: "A visually driven fitness space designed for training, content and everyday use.",
    card: p5,
    hero: p5,
    gallery: [{ src: p6, alt: "UK Fitness Paschim Vihar interior" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for UK Fitness",
      caption:
        "Equipment, mirrors and lighting were positioned together so the space could create visual moments without compromising everyday training.",
    },
    study: {
      brief:
        "The clients wanted a space that looked visually appealing from every corner, photographed well for their vlogs and content, and still worked as a functional gym.",
      user:
        "The space needed to work for regular gym users while also supporting a content-driven brand. This meant creating visually interesting moments without allowing the interiors to become more about photography than training.",
      challenge:
        "The challenge was to create different-looking corners while maintaining one consistent design language. Too much visual variety could easily make the gym feel cluttered or disconnected.",
      decisions:
        "Machines were positioned carefully so that mirrors and lighting could create different visual moments around the floor. The gym name was incorporated into the centre of the ceiling, while multiple logo elements strengthened the brand presence.",
      outcome:
        "The space created multiple corners that worked well for photography without compromising the workout experience. Mirror placement was also considered so users could see their back muscles properly while training.",
      learning:
        "The project showed that content-friendly interiors do not need to compromise function. When equipment, mirrors, lighting and branding are planned together from the beginning, the space can work naturally for both training and content.",
    },
    detail: {
      title: "UK FITNESS · Paschim Vihar, Delhi, India",
      visualIntro:
        "For UK Fitness, the interior had to work in two ways. It needed to support a functional workout while also creating enough visual variety for photographs, videos and the brand's content.",
      visualHeadline: "Designed for training and the camera",
      planHeadline: "Planning for the workout and the camera",
      planTags: "Mirrors · Lighting · Content · Function",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Paschim Vihar, Delhi, India" },
        { k: "Project type", v: "FITNESS GYM" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "UK FITNESS" },
  },
  {
    slug: "reshape-prime-naraina-vihar",
    name: "RESHAPE PRIME",
    location: "Naraina Vihar, Delhi, India",
    category: "Gym Projects",
    cardLabel: "GYM INTERIOR",
    hideCardMeta: true,
    area: "",
    year: "",
    clientType: "STRENGTH & TRAINING GYM",
    insight: "A simple, powerful gym interior built around an all-black aesthetic and focused lighting.",
    card: p6,
    hero: p6,
    gallery: [{ src: floorplan, alt: "Reshape Prime layout planning" }],
    plan: {
      src: floorplan,
      alt: "Planning diagram for Reshape Prime",
      caption:
        "The space was planned zone by zone so changing equipment requirements could be accommodated without losing the clarity of the overall layout.",
    },
    study: {
      brief:
        "The client wanted a simple gym aesthetic with an all-black interior and a strong focus on lighting. The design needed to feel powerful without becoming unnecessarily complicated.",
      user:
        "The space needed to accommodate the required equipment while maintaining the focused atmosphere the client wanted. The design had to make the gym feel intentional even as the equipment requirements continued to change.",
      challenge:
        "The number of equipment pieces and the available space did not initially align, and the equipment list continued to change during the process. The studio also had only 15 to 20 days to complete the design.",
      decisions:
        "Instead of trying to resolve the entire space at once, we worked zone by zone. This allowed the changing equipment requirements to be accommodated while keeping the overall design simple, elegant and cohesive.",
      outcome:
        "The final approach created a powerful training environment without adding unnecessary visual elements. The zoning helped accommodate the requirements while maintaining the simplicity of the original brief.",
      learning:
        "This project reinforced how useful a clear design system can be when the brief keeps moving. Breaking the gym into zones allowed us to stay flexible without losing the larger design direction.",
    },
    detail: {
      title: "RESHAPE PRIME · Naraina Vihar, Delhi, India",
      visualIntro:
        "Reshape Prime came with a clear visual direction but a moving brief. The equipment list kept changing and the design had to be completed quickly, making flexibility just as important as the final aesthetic.",
      visualHeadline: "Simple, elegant, powerful",
      planHeadline: "Planning around a moving equipment list",
      planTags: "Zoning · Equipment · Lighting · Flexibility",
      ...discussCta,
      outcomes: [
        { k: "Location", v: "Naraina Vihar, Delhi, India" },
        { k: "Project type", v: "STRENGTH & TRAINING GYM" },
      ],
    },
    testimonial: { quote: "", author: "Client", role: "RESHAPE PRIME" },
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
