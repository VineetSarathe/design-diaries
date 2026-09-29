import path from "node:path";
import { Project } from "../models/project.model";
import { storeImageFromPath } from "../utils/store-image";

const ASSETS = path.resolve(__dirname, "../../gym-space-craft-main/src/assets");

type SeedProject = {
  slug: string;
  name: string;
  location: string;
  clientType: string;
  insight: string;
  cardFile: string;
  galleryFile: string;
  study: {
    brief: string;
    user: string;
    challenge: string;
    decisions: string;
    outcome: string;
    learning: string;
  };
};

const ADDITIONAL: SeedProject[] = [
  {
    slug: "q3-fitness-rohini",
    name: "Q3 FITNESS",
    location: "Rohini, Delhi, India",
    clientType: "COMMUNITY FITNESS GYM",
    insight:
      "A community-focused gym bringing its red and black identity into a balanced, functional interior.",
    cardFile: "project-1.jpg",
    galleryFile: "gallery-1.jpg",
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
  },
  {
    slug: "vstrongr-studio-vasant-vihar",
    name: "VSTRONGR STUDIO",
    location: "Vasant Vihar, Delhi, India",
    clientType: "PERSONAL TRAINING STUDIO",
    insight: "A personal training studio designed around movement, performance and recovery.",
    cardFile: "project-2.jpg",
    galleryFile: "hero-gym.jpg",
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
  },
  {
    slug: "bharat-fitness-den-bhubaneswar",
    name: "BHARAT FITNESS DEN",
    location: "Bhubaneswar, India",
    clientType: "LUXURY FITNESS & WELLNESS",
    insight: "A luxury fitness space where training, wellness and hospitality come together.",
    cardFile: "project-3.jpg",
    galleryFile: "case-study.jpg",
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
  },
  {
    slug: "the-fitness-matters-gym-ambajogai",
    name: "THE FITNESS MATTERS GYM",
    location: "Ambajogai, India",
    clientType: "TRAINING GYM",
    insight: "A dark, atmospheric gym shaped by lighting, zoning and everyday training.",
    cardFile: "project-4.jpg",
    galleryFile: "project-5.jpg",
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
  },
  {
    slug: "uk-fitness-paschim-vihar",
    name: "UK FITNESS",
    location: "Paschim Vihar, Delhi, India",
    clientType: "FITNESS GYM",
    insight: "A visually driven fitness space designed for training, content and everyday use.",
    cardFile: "project-5.jpg",
    galleryFile: "project-6.jpg",
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
  },
  {
    slug: "reshape-prime-naraina-vihar",
    name: "RESHAPE PRIME",
    location: "Naraina Vihar, Delhi, India",
    clientType: "STRENGTH & TRAINING GYM",
    insight: "A simple, powerful gym interior built around an all-black aesthetic and focused lighting.",
    cardFile: "project-6.jpg",
    galleryFile: "floorplan.jpg",
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
  },
];

export async function seedAdditionalWorkProjects(): Promise<void> {
  const maxOrder = await Project.find().sort({ sortOrder: -1 }).limit(1).select("sortOrder");
  let nextOrder = (maxOrder[0]?.sortOrder ?? 0) + 1;

  for (const item of ADDITIONAL) {
    const existing = await Project.findOne({ slug: item.slug });
    let cardUrl = existing?.cardUrl ?? "";
    let cardPublicId = existing?.cardPublicId ?? "";
    let images = existing?.images?.length ? [...existing.images] : [];

    if (!cardUrl) {
      const card = await storeImageFromPath(
        path.join(ASSETS, item.cardFile),
        `${item.slug}-card`,
        "projects",
        `${item.slug}-card${path.extname(item.cardFile)}`,
      );
      cardUrl = card.imageUrl;
      cardPublicId = card.imagePublicId;
    }

    if (!images.length) {
      const gallery = await storeImageFromPath(
        path.join(ASSETS, item.galleryFile),
        `${item.slug}-gallery-1`,
        "projects",
        `${item.slug}-gallery-1${path.extname(item.galleryFile)}`,
      );
      images = [
        {
          url: gallery.imageUrl,
          publicId: gallery.imagePublicId,
          alt: `${item.name} interior`,
          caption: "",
          kind: "image" as const,
        },
      ];
    }

    await Project.findOneAndUpdate(
      { slug: item.slug },
      {
        $set: {
          slug: item.slug,
          name: item.name,
          location: item.location,
          category: "Gym Projects",
          area: "",
          year: "",
          clientType: item.clientType,
          cardLabel: "GYM INTERIOR",
          hideCardMeta: true,
          insight: item.insight,
          study: item.study,
          cardUrl,
          cardPublicId,
          images,
          reviewQuote: "",
          reviewAuthor: "",
          reviewRole: "",
          sortOrder: existing?.sortOrder ?? nextOrder++,
        },
      },
      { upsert: true },
    );
  }

  console.log(`Additional work projects ready (${ADDITIONAL.length})`);
}
